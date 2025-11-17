"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2, ChefHat, Upload } from "lucide-react";
import { QuickTemplates } from "./QuickTemplates";
import { RecipeTemplate, generateRandomRecipe } from "@/lib/recipe-templates";

interface RecipeFormData {
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
  ingredients: Array<{ name: string; quantity: number; unit: string }>;
  instructions: string[];
  tags: string[];
  status: "draft" | "published";
}

interface RecipeSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: RecipeFormData) => void;
}

const cuisineOptions = ["Японська", "Італійська", "Українська", "Таїландська", "Американська", "Китайська", "Французька"];
const unitOptions = ["г", "мл", "чайна ложка", "столова ложка", "чашка", "шт"];

export function RecipeSidePanel({ isOpen, onClose, onSubmit }: RecipeSidePanelProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: "",
    description: "",
    image: "🍳",
    cuisine: "",
    difficulty: "medium",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    calories: 300,
    price: 35,
    ingredients: [],
    instructions: [],
    tags: [],
    status: "draft",
  });

  const [newIngredient, setNewIngredient] = useState({ name: "", quantity: 0, unit: "г" });
  const [newInstruction, setNewInstruction] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity > 0) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient],
      }));
      setNewIngredient({ name: "", quantity: 0, unit: "г" });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setFormData((prev) => ({
        ...prev,
        instructions: [...prev.instructions, newInstruction],
      }));
      setNewInstruction("");
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async () => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Назва рецепту");
    }
    if (!formData.description.trim()) {
      errors.push("Опис");
    }
    if (!formData.cuisine) {
      errors.push("Кухня");
    }
    if (formData.ingredients.length === 0) {
      errors.push("Інгредієнти (мінімум 1)");
    }
    if (formData.instructions.length === 0) {
      errors.push("Інструкції (мінимум 1)");
    }

    if (errors.length > 0) {
      alert(`Будь ласка, заповніть обов'язкові поля:\n• ${errors.join("\n• ")}`);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);

    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "🍳",
      cuisine: "",
      difficulty: "medium",
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      calories: 300,
      price: 35,
      ingredients: [],
      instructions: [],
      tags: [],
      status: "draft",
    });
    setNewIngredient({ name: "", quantity: 0, unit: "г" });
    setNewInstruction("");
    setNewTag("");
  };

  // Функция быстрого заполнения из шаблона
  const handleLoadTemplate = (template: RecipeTemplate) => {
    setFormData({
      name: template.name,
      description: template.description,
      image: template.image,
      cuisine: template.cuisine,
      difficulty: template.difficulty,
      prepTime: template.prepTime,
      cookTime: template.cookTime,
      servings: template.servings,
      calories: template.calories,
      price: template.price,
      ingredients: template.ingredients,
      instructions: template.instructions,
      tags: template.tags,
      status: "draft",
    });
  };

  const handleGenerateRandom = () => {
    const randomData = generateRandomRecipe() as RecipeTemplate;
    handleLoadTemplate(randomData);
  };

  const handleAutoFillDescription = () => {
    if (!formData.description && formData.name) {
      const descriptions: Record<string, string> = {
        "суші": "Традиційна японська страва з рисом і свіжими інгредієнтами",
        "паста": "Класична італійська паста з вишуканим соусом",
        "борщ": "Традиційний український суп з бурячком",
        "рамен": "Ароматне японське локшаное блюдо",
        "бургер": "Справжній бургер з сочною котлетою",
        "суп": "Смачний суп з овочами",
        "салат": "Свіжий та здоровий салат",
        "риба": "Деліатне блюдо з риби",
        "курица": "Смачне блюдо з куриці",
        "овочі": "Улюблене вегетаріанське блюдо",
      };

      for (const [key, desc] of Object.entries(descriptions)) {
        if (formData.name.toLowerCase().includes(key)) {
          setFormData({ ...formData, description: desc });
          return;
        }
      }

      setFormData({
        ...formData,
        description: `${formData.name} - смачна та поживна страва, приготована з найкращих інгредієнтів.`,
      });
    }
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
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2 xl:w-5/12 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 flex-shrink-0">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ChefHat size={28} />
                Створення рецепту
              </h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Основна інформація</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Назва рецепту
                      <span className="text-red-500 font-bold ml-1">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Суші Райнбоу"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Опис
                        <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <button
                        onClick={handleAutoFillDescription}
                        disabled={!formData.name}
                        className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Автоматично заповнити опис на основі назви"
                      >
                        💡 Авто
                      </button>
                    </div>
                    <textarea
                      placeholder="Детальний опис рецепту..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Фото рецепту
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-5xl shadow-lg border-2 border-purple-200 dark:border-purple-800 flex-shrink-0">
                        {formData.image}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("Файл занадто великий. Максимальний розмір 5MB");
                                  return;
                                }

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({
                                    ...formData,
                                    image: reader.result as string,
                                  });
                                };
                                reader.onerror = () => {
                                  alert("Помилка при завантаженні файлу");
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id="recipe-image-upload-panel"
                          />
                          <label
                            htmlFor="recipe-image-upload-panel"
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                          >
                            <Upload size={16} />
                            Загрузити
                          </label>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs text-slate-600 dark:text-slate-400">Емодзі:</p>
                          <div className="grid grid-cols-4 gap-1">
                            {["🍣", "🍝", "🍲", "🥘", "🍰", "🍔", "🌮", "🥗"].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => setFormData({ ...formData, image: emoji })}
                                className={`text-xl p-1 rounded transition-all ${
                                  formData.image === emoji
                                    ? "bg-purple-200 dark:bg-purple-900/50 scale-110"
                                    : "hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Кухня
                        <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <select
                        value={formData.cuisine}
                        onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value="">Виберіть</option>
                        {cuisineOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Складність
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value="easy">Легко</option>
                        <option value="medium">Середньо</option>
                        <option value="hard">Складно</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Templates */}
                  {formData.cuisine && (
                    <QuickTemplates
                      cuisine={formData.cuisine}
                      onSelectTemplate={handleLoadTemplate}
                      onGenerateRandom={handleGenerateRandom}
                    />
                  )}
                </div>
              </div>

              {/* Time and Servings */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Час та виходу</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Підготовка (хв)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.prepTime}
                      onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Готування (хв)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.cookTime}
                      onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Порції
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.servings}
                      onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Калорій
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Price and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ціна (ChefTokens)
                  </label>
                  <Input
                    type="number"
                    min="5"
                    step="5"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Статус
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormData({ ...formData, status: "draft" })}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                        formData.status === "draft"
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-yellow-500"
                      }`}
                    >
                      Чернетка
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, status: "published" })}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                        formData.status === "published"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-green-500"
                      }`}
                    >
                      Опублік.
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Info Card */}
              <div className={`p-3 rounded-lg border-l-4 flex items-start gap-2 text-sm ${
                formData.status === "published"
                  ? "bg-green-50 dark:bg-green-900/20 border-l-green-600 text-green-900 dark:text-green-300"
                  : "bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-600 text-yellow-900 dark:text-yellow-300"
              }`}>
                <div className="w-4 h-4 flex-shrink-0 mt-0.5">
                  {formData.status === "published" ? (
                    <svg className="w-full h-full fill-current" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  ) : (
                    <svg className="w-full h-full fill-current" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {formData.status === "published" ? "Опублікований" : "Чернетка"}
                  </p>
                  <p className="text-xs opacity-90 mt-0.5">
                    {formData.status === "published"
                      ? "Видимий для всіх користувачів"
                      : "Можна редагувати пізніше"}
                  </p>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  Інгредієнти
                  <span className="text-red-500 font-bold">*</span>
                  {formData.ingredients.length > 0 && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                      {formData.ingredients.length}
                    </span>
                  )}
                </h3>
                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                  {formData.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded text-sm">
                      <span className="text-slate-700 dark:text-slate-300">
                        {ing.quantity} {ing.unit} {ing.name}
                      </span>
                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Назва інгредієнта"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 text-sm"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Кількість"
                      value={newIngredient.quantity}
                      onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800 text-sm"
                    />

                    <select
                      value={newIngredient.unit}
                      onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                      className="px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    >
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>

                    <Button
                      onClick={handleAddIngredient}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm h-10"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  Інструкції
                  <span className="text-red-500 font-bold">*</span>
                  {formData.instructions.length > 0 && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                      {formData.instructions.length}
                    </span>
                  )}
                </h3>
                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                  {formData.instructions.map((instr, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="flex-1 text-slate-700 dark:text-slate-300">{instr}</p>
                      <button
                        onClick={() => handleRemoveInstruction(idx)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <textarea
                    placeholder="Опишіть наступний крок..."
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <Button
                    onClick={handleAddInstruction}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm"
                  >
                    <Plus size={16} className="mr-2" />
                    Додати крок
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Теги</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveTag(tag)}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium flex items-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      {tag}
                      <X size={12} />
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Додайте тег"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                  <Button
                    onClick={handleAddTag}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Spacer */}
              <div className="h-4" />
            </div>

            {/* Footer - Sticky */}
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                  formData.status === "published"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Створення...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    {formData.status === "published" ? "Опублікувати" : "Чернетка"}
                  </>
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 font-semibold text-sm"
              >
                Закрити
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
