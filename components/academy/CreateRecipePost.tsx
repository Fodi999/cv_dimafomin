"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Plus, Trash2, Image as ImageIcon, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreateRecipePostData, IngredientData } from "@/lib/types";
import { RECIPE_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants";

interface CreateRecipePostProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecipePostData) => Promise<void>;
}

export default function CreateRecipePost({ isOpen, onClose, onSubmit }: CreateRecipePostProps) {
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

  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingNutrition, setLoadingNutrition] = useState<{ [key: number]: boolean }>({});

  // Fetch ingredient nutrition data from backend
  const fetchIngredientNutrition = async (index: number, ingredientName: string, weight?: number) => {
    if (!ingredientName.trim()) return;

    setLoadingNutrition(prev => ({ ...prev, [index]: true }));

    try {
      let nutritionData: any = null;

      // Try to fetch from backend first
      try {
        const { aiApi } = await import("@/lib/api");
        const token = localStorage.getItem("token");
        nutritionData = await aiApi.getIngredientNutrition(ingredientName, weight, token || undefined);
      } catch (apiError) {
        console.log("API not available, using local database");
        
        // Fallback to local nutrition database
        const { getNutritionInfo } = await import("@/lib/nutrition-data");
        nutritionData = getNutritionInfo(ingredientName, weight);
      }

      if (!nutritionData) {
        console.log(`No nutrition data found for: ${ingredientName}`);
        return;
      }
      
      // Update ingredient with nutrition data
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((item, i) => {
          if (i === index) {
            const ingredient = typeof item === 'string' ? { name: item } : item;
            return {
              ...ingredient,
              calories: nutritionData?.calories || ingredient.calories,
              protein: nutritionData?.protein || ingredient.protein,
              fat: nutritionData?.fat || ingredient.fat,
              carbs: nutritionData?.carbs || ingredient.carbs,
              totalCalories: nutritionData?.totalCalories || ingredient.totalCalories,
            } as IngredientData;
          }
          return item;
        }),
      }));
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      // Silently fail, don't block user
    } finally {
      setLoadingNutrition(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, завантажте зображення");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Максимальний розмір файлу - 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary (or your image service)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "recipe_posts"); // Configure in Cloudinary

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Помилка завантаження фото. Спробуйте ще раз.");
    } finally {
      setUploading(false);
    }
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", brutto: undefined, netto: undefined, unit: "г" }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, field: keyof IngredientData, value: string | number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => {
        if (i === index) {
          const ingredient = typeof item === 'string' ? { name: item } : item;
          const updated = { ...ingredient, [field]: value } as IngredientData;
          
          // Auto-fetch nutrition when name changes or weight changes
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

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, ""],
    }));
  };

  const removeStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      alert(community?.titleRequired || "Додайте назву страви");
      return;
    }
    if (!formData.imageUrl) {
      alert(community?.imageRequired || "Завантажте фото страви");
      return;
    }
    
    // Check if at least one ingredient has a name
    const validIngredients = formData.ingredients.filter((i) => {
      const name = typeof i === 'string' ? i.trim() : i.name?.trim();
      return name && name.length > 0;
    });
    
    if (validIngredients.length === 0) {
      alert(community?.ingredientsRequired || "Додайте хоча б один інгредієнт");
      return;
    }
    
    if (formData.steps.filter((s) => s.trim()).length === 0) {
      alert(community?.stepsRequired || "Додайте хоча б один крок приготування");
      return;
    }

    setSubmitting(true);

    try {
      // Calculate totals for backend
      const ingredients = validIngredients.filter(i => typeof i !== 'string') as IngredientData[];
      const totalCalories = ingredients.reduce((sum, ing) => sum + (ing.totalCalories || 0), 0);
      const totalProtein = ingredients.reduce((sum, ing) => sum + (ing.protein || 0) * ((ing.netto || ing.brutto || 0) / 100), 0);
      const totalFat = ingredients.reduce((sum, ing) => sum + (ing.fat || 0) * ((ing.netto || ing.brutto || 0) / 100), 0);
      const totalCarbs = ingredients.reduce((sum, ing) => sum + (ing.carbs || 0) * ((ing.netto || ing.brutto || 0) / 100), 0);
      const totalCost = ingredients.reduce((sum, ing) => sum + (ing.cost || 0), 0);
      const totalGrossWeight = ingredients.reduce((sum, ing) => sum + (ing.brutto || 0), 0);
      const totalNetWeight = ingredients.reduce((sum, ing) => sum + (ing.netto || 0), 0);
      
      // Calculate tokens reward based on complexity
      let tokensReward = 10; // base reward
      if (validIngredients.length > 5) tokensReward += 5;
      if (formData.steps.filter(s => s.trim()).length > 3) tokensReward += 5;
      if (formData.difficulty === 'advanced') tokensReward += 10;
      else if (formData.difficulty === 'intermediate') tokensReward += 5;

      // Prepare data for backend
      const cleanedData = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl || "",
        category: formData.category,
        difficulty: formData.difficulty,
        cookingTime: formData.cookingTime,
        servings: formData.servings,
        // Backend-specific fields
        grossWeight: Math.round(totalGrossWeight),
        netWeight: Math.round(totalNetWeight),
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein * 10) / 10,
        fats: Math.round(totalFat * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        yield: Math.round(totalNetWeight), // same as netWeight for now
        cost: Math.round(totalCost * 100) / 100,
        tokensReward: tokensReward,
        // Keep original data for frontend
        ingredients: validIngredients,
        steps: formData.steps.filter((s) => s.trim()),
      };

      await onSubmit(cleanedData);

      // Reset form
      setFormData({
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
      setImagePreview("");
      onClose();
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Помилка створення посту. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#3BC864] to-[#C5E98A] p-6 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">
                {community?.createPost || "Поділіться своєю стравою"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                📸 {community?.photoLabel || "Фото страви"} *
              </label>
              
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#3BC864] transition-colors bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="w-12 h-12 text-[#3BC864] animate-spin mb-3" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                    )}
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">{community?.clickToUpload || "Клікніть для завантаження"}</span>
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
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => {
                      setImagePreview("");
                      setFormData((prev) => ({ ...prev, imageUrl: "" }));
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                📝 {community?.titleLabel || "Назва страви"} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={community?.titlePlaceholder || "напр. Ідеальні суші з лососем"}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                ✍️ {community?.descriptionLabel || "Опис"}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={community?.descriptionPlaceholder || "Розкажіть про вашу страву..."}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none resize-none"
              />
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                  🍱 {community?.categoryLabel || "Категорія"}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
                >
                  <option value="">Оберіть категорію</option>
                  {RECIPE_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                  🔥 {community?.difficultyLabel || "Складність"}
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
                >
                  {DIFFICULTY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                  ⏱️ {community?.timeLabel || "Час (хв)"}
                </label>
                <input
                  type="number"
                  value={formData.cookingTime || ""}
                  onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || undefined })}
                  placeholder="30"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                  👥 {community?.servingsLabel || "Порцій"}
                </label>
                <input
                  type="number"
                  value={formData.servings || ""}
                  onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || undefined })}
                  placeholder="2"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1A41] mb-3">
                🥬 {community?.ingredientsLabel || "Інгредієнти"} *
              </label>
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => {
                  const ingredientData = typeof ingredient === 'string' 
                    ? { name: ingredient, brutto: undefined, netto: undefined, unit: 'г' }
                    : ingredient;
                  
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-3 border-2 border-gray-200">
                      <div className="flex flex-col gap-2">
                        {/* Ingredient Name */}
                        <div className="flex gap-2 items-start">
                          <div className="flex-shrink-0 w-7 h-7 bg-[#3BC864] text-white rounded-full flex items-center justify-center font-bold text-xs mt-1">
                            {index + 1}
                          </div>
                          <input
                            type="text"
                            value={ingredientData.name}
                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                            placeholder={`${community?.ingredient || "Назва інгредієнта"}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#3BC864] focus:outline-none text-sm"
                          />
                          {formData.ingredients.length > 1 && (
                            <button
                              onClick={() => removeIngredient(index)}
                              className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Brutto / Netto / Unit / Cost */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-9">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Брутто (г)</label>
                            <input
                              type="number"
                              value={ingredientData.brutto || ''}
                              onChange={(e) => updateIngredient(index, 'brutto', parseFloat(e.target.value) || undefined)}
                              placeholder="150"
                              min="0"
                              step="0.1"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:border-[#3BC864] focus:outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Нетто (г)</label>
                            <input
                              type="number"
                              value={ingredientData.netto || ''}
                              onChange={(e) => updateIngredient(index, 'netto', parseFloat(e.target.value) || undefined)}
                              placeholder="120"
                              min="0"
                              step="0.1"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:border-[#3BC864] focus:outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Од. виміру</label>
                            <select
                              value={ingredientData.unit || 'г'}
                              onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:border-[#3BC864] focus:outline-none text-sm"
                            >
                              <option value="г">г</option>
                              <option value="кг">кг</option>
                              <option value="мл">мл</option>
                              <option value="л">л</option>
                              <option value="шт">шт</option>
                              <option value="ч.л.">ч.л.</option>
                              <option value="ст.л.">ст.л.</option>
                              <option value="склянка">скл</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">💰 Ціна (грн)</label>
                            <input
                              type="number"
                              value={ingredientData.cost || ''}
                              onChange={(e) => updateIngredient(index, 'cost', parseFloat(e.target.value) || undefined)}
                              placeholder="5.50"
                              min="0"
                              step="0.01"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:border-[#3BC864] focus:outline-none text-sm"
                            />
                          </div>
                        </div>

                        {/* Nutrition Info (auto-calculated) */}
                        {(ingredientData.calories || ingredientData.totalCalories || loadingNutrition[index]) && (
                          <div className="ml-9 mt-2 p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                            {loadingNutrition[index] ? (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Завантаження харчової цінності...</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
                                  <span>📊 Харчова цінність (на 100г):</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                  {ingredientData.calories !== undefined && (
                                    <div className="bg-white px-2 py-1 rounded">
                                      <span className="text-gray-500">Калорії: </span>
                                      <span className="font-bold text-orange-600">{ingredientData.calories} ккал</span>
                                    </div>
                                  )}
                                  {ingredientData.protein !== undefined && (
                                    <div className="bg-white px-2 py-1 rounded">
                                      <span className="text-gray-500">Білки: </span>
                                      <span className="font-bold text-blue-600">{ingredientData.protein}г</span>
                                    </div>
                                  )}
                                  {ingredientData.fat !== undefined && (
                                    <div className="bg-white px-2 py-1 rounded">
                                      <span className="text-gray-500">Жири: </span>
                                      <span className="font-bold text-yellow-600">{ingredientData.fat}г</span>
                                    </div>
                                  )}
                                  {ingredientData.carbs !== undefined && (
                                    <div className="bg-white px-2 py-1 rounded">
                                      <span className="text-gray-500">Вугл: </span>
                                      <span className="font-bold text-green-600">{ingredientData.carbs}г</span>
                                    </div>
                                  )}
                                </div>
                                {ingredientData.totalCalories !== undefined && (
                                  <div className="mt-1 pt-1 border-t border-green-200">
                                    <span className="text-xs text-gray-600">Всього в порції: </span>
                                    <span className="text-xs font-bold text-orange-700">{ingredientData.totalCalories.toFixed(0)} ккал</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={addIngredient}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#3BC864] hover:text-[#3BC864] transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  {community?.addIngredient || "Додати інгредієнт"}
                </button>

                {/* Total Recipe Nutrition Summary */}
                {(() => {
                  const ingredients = formData.ingredients.filter(i => typeof i !== 'string') as IngredientData[];
                  const totalCalories = ingredients.reduce((sum, ing) => sum + (ing.totalCalories || 0), 0);
                  const totalProtein = ingredients.reduce((sum, ing) => sum + (ing.protein || 0) * ((ing.netto || ing.brutto || 0) / 100), 0);
                  const totalFat = ingredients.reduce((sum, ing) => sum + (ing.fat || 0) * ((ing.netto || ing.brutto || 0) / 100), 0);
                  const totalCarbs = ingredients.reduce((sum, ing) => sum + (ing.carbs || 0) * ((ing.netto || ing.brutto || 0) / 100), 0);
                  const totalCost = ingredients.reduce((sum, ing) => sum + (ing.cost || 0), 0);
                  const totalGrossWeight = ingredients.reduce((sum, ing) => sum + (ing.brutto || 0), 0);
                  const totalNetWeight = ingredients.reduce((sum, ing) => sum + (ing.netto || 0), 0);
                  const hasNutrition = totalCalories > 0 || totalProtein > 0 || totalFat > 0 || totalCarbs > 0 || totalCost > 0;

                  return hasNutrition ? (
                    <div className="mt-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-orange-900 flex items-center gap-2">
                          📊 Загальна статистика рецепту
                        </h4>
                        {formData.servings && totalCalories > 0 && (
                          <span className="text-xs text-orange-700 bg-white px-2 py-1 rounded-full">
                            На 1 порцію: {(totalCalories / formData.servings).toFixed(0)} ккал
                          </span>
                        )}
                      </div>
                      
                      {/* Nutrition Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                        <div className="bg-white p-2 rounded-lg text-center">
                          <div className="text-xl font-bold text-orange-600">{totalCalories.toFixed(0)}</div>
                          <div className="text-xs text-gray-600">ккал</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg text-center">
                          <div className="text-xl font-bold text-blue-600">{totalProtein.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">г білків</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg text-center">
                          <div className="text-xl font-bold text-yellow-600">{totalFat.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">г жирів</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg text-center">
                          <div className="text-xl font-bold text-green-600">{totalCarbs.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">г вугл.</div>
                        </div>
                      </div>

                      {/* Weight & Cost Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="bg-white p-2 rounded-lg text-center">
                          <div className="text-lg font-bold text-purple-600">{totalGrossWeight.toFixed(0)}</div>
                          <div className="text-xs text-gray-600">г брутто</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg text-center">
                          <div className="text-lg font-bold text-indigo-600">{totalNetWeight.toFixed(0)}</div>
                          <div className="text-xs text-gray-600">г нетто</div>
                        </div>
                        {totalCost > 0 && (
                          <div className="bg-white p-2 rounded-lg text-center">
                            <div className="text-lg font-bold text-emerald-600">{totalCost.toFixed(2)}</div>
                            <div className="text-xs text-gray-600">грн (вартість)</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                👨‍🍳 {community?.stepsLabel || "Кроки приготування"} *
              </label>
              <div className="space-y-3">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#3BC864] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <textarea
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`${community?.step || "Крок"} ${index + 1}`}
                      rows={2}
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none resize-none"
                    />
                    {formData.steps.length > 1 && (
                      <button
                        onClick={() => removeStep(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addStep}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#3BC864] hover:text-[#3BC864] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {community?.addStep || "Додати крок"}
                </button>
              </div>
            </div>

            {/* AI Generate Button */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-purple-900 flex items-center gap-2">
                    🤖 AI Асистент Шеф-кухаря
                  </h4>
                  <p className="text-xs text-purple-700 mt-1">
                    Згенеруйте професійний рецепт з харчовою цінністю та інструкціями
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => {/* TODO: Implement AI generation */}}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  disabled={submitting}
                >
                  ✨ Згенерувати
                </Button>
              </div>
            </div>

            {/* Tokens Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-amber-900">
                    💰 <strong>{community?.earnTokensInfo || "Заробіть ChefTokens!"}</strong>
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {community?.earnTokensDesc || "Базова нагорода: 10 CT + бонуси за перегляди та взаємодію"}
                  </p>
                </div>
                <div className="bg-white rounded-xl px-4 py-2 text-center ml-4">
                  <div className="text-2xl font-bold text-amber-600">
                    {(() => {
                      // Calculate tokens based on recipe complexity
                      let tokens = 10; // base reward
                      if (formData.ingredients.length > 5) tokens += 5;
                      if (formData.steps.length > 3) tokens += 5;
                      if (formData.difficulty === 'advanced') tokens += 10;
                      if (formData.difficulty === 'intermediate') tokens += 5;
                      return tokens;
                    })()}
                  </div>
                  <div className="text-xs text-gray-600">ChefTokens</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={submitting}
              >
                {community?.cancel || "Скасувати"}
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-[#3BC864] to-[#C5E98A] hover:opacity-90"
                disabled={submitting || uploading}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {community?.publishing || "Публікація..."}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    {community?.publish || "Опублікувати"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
