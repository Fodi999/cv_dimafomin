"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2, ChefHat, Upload, Image as ImageIcon } from "lucide-react";
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

interface RecipeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: RecipeFormData) => void;
}

const cuisineOptions = ["Японська", "Італійська", "Українська", "Таїландська", "Американська", "Китайська", "Французька"];
const difficultyOptions: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];
const unitOptions = ["г", "мл", "чайна ложка", "столова ложка", "чашка", "шт"];

export function RecipeCreateModal({ isOpen, onClose, onSubmit }: RecipeCreateModalProps) {
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
    // Валидация обязательных полей
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

  // Функция генерации случайного рецепта для тестирования
  const handleGenerateRandom = () => {
    const randomData = generateRandomRecipe() as RecipeTemplate;
    handleLoadTemplate(randomData);
  };

  // Быстрое заполнение названия
  const handleQuickFillName = (suggestion: string) => {
    setFormData({ ...formData, name: suggestion });
  };

  // Быстрое заполнение описания на основе названия
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

      // За замовчуванням
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
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl z-50 bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ChefHat size={28} />
                Створення нового рецепту
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

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Фото рецепту
                    </label>
                    <div className="flex items-center gap-4">
                      {/* Image Preview */}
                      <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl shadow-lg border-2 border-purple-200 dark:border-purple-800">
                        {formData.image}
                      </div>

                      {/* Upload Options */}
                      <div className="flex-1 space-y-3">
                        {/* File Input */}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Проверка размера файла (максимум 5MB)
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
                            id="recipe-image-upload"
                          />
                          <label
                            htmlFor="recipe-image-upload"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800"
                          >
                            <Upload size={18} className="text-slate-600 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Завантажити фото
                            </span>
                          </label>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            JPG, PNG, WebP, GIF • Максимум 5MB
                          </p>
                        </div>

                        {/* Emoji Picker Quick Select */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Або виберіть емодзі:</p>
                          <div className="grid grid-cols-4 gap-2">
                            {["🍣", "🍝", "🍲", "🥘", "🍰", "🍔", "🌮", "🥗"].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => setFormData({ ...formData, image: emoji })}
                                className={`text-2xl p-2 rounded-lg transition-all ${
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
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Виберіть кухню</option>
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
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Час та выходу</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Час підготовки (хв)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.prepTime}
                      onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Час готування (хв)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.cookTime}
                      onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Порції
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.servings}
                      onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Калорій (на порцію)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Price and Publication Status */}
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
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        formData.status === "draft"
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-yellow-500"
                      }`}
                    >
                      Чернетка
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, status: "published" })}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        formData.status === "published"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-green-500"
                      }`}
                    >
                      Опублікувати
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Info Card */}
              <div className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
                formData.status === "published"
                  ? "bg-green-50 dark:bg-green-900/20 border-l-green-600 text-green-900 dark:text-green-300"
                  : "bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-600 text-yellow-900 dark:text-yellow-300"
              }`}>
                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
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
                  <p className="font-semibold text-sm">
                    {formData.status === "published" ? "Статус: Опублікований" : "Статус: Чернетка"}
                  </p>
                  <p className="text-xs mt-1 opacity-90">
                    {formData.status === "published"
                      ? "Рецепт буде видимий для всіх користувачів відразу після створення"
                      : "Рецепт можна буде редагувати і опублікувати пізніше"}
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
                <div className="space-y-3 mb-4">
                  {formData.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <span className="text-slate-700 dark:text-slate-300">
                        {ing.quantity} {ing.unit} {ing.name}
                      </span>
                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="Назва інгредієнта"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800"
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Кількість"
                      value={newIngredient.quantity}
                      onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
                      className="bg-slate-50 dark:bg-slate-800"
                    />

                    <select
                      value={newIngredient.unit}
                      onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>

                    <Button
                      onClick={handleAddIngredient}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    >
                      <Plus size={18} />
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
                <div className="space-y-3 mb-4">
                  {formData.instructions.map((instr, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="flex-1 text-slate-700 dark:text-slate-300 text-sm">{instr}</p>
                      <button
                        onClick={() => handleRemoveInstruction(idx)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <textarea
                    placeholder="Опишіть наступний крок..."
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    onClick={handleAddInstruction}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  >
                    <Plus size={18} className="mr-2" />
                    Додати крок
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Теги</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tags.map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveTag(tag)}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      {tag}
                      <X size={14} />
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Додайте тег (e.g. суші, морепродукти)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    className="flex-1 bg-slate-50 dark:bg-slate-800"
                  />
                  <Button
                    onClick={handleAddTag}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 font-semibold flex items-center justify-center gap-2 transition-all ${
                  formData.status === "published"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Створення...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    {formData.status === "published" ? "Опублікувати рецепт" : "Зберегти як чернетку"}
                  </>
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 font-semibold"
              >
                Скасувати
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
