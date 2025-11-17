"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2, ChefHat, Upload, Image as ImageIcon } from "lucide-react";

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
  status: "draft" | "published" | "archived";
  tags: string[];
  ingredients?: Array<{ name: string; quantity: number; unit: string }>;
  instructions?: string[];
}

interface RecipeEditModalProps {
  isOpen: boolean;
  recipe: Recipe;
  onClose: () => void;
  onSubmit: (recipe: any) => void;
}

const cuisineOptions = ["Японська", "Італійська", "Українська", "Таїландська", "Американська", "Китайська", "Французька"];
const unitOptions = ["г", "мл", "чайна ложка", "столова ложка", "чашка", "шт"];

export function RecipeEditModal({ isOpen, recipe, onClose, onSubmit }: RecipeEditModalProps) {
  const [formData, setFormData] = useState({
    name: recipe.name,
    description: recipe.description,
    image: recipe.image,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    calories: recipe.calories,
    price: recipe.price,
    status: recipe.status,
    tags: recipe.tags || [],
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
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
    if (!formData.name || !formData.cuisine) {
      alert("Будь ласка, заповніть назву та кухню");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);

    onSubmit(formData);
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
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ChefHat size={28} />
                Редагування рецепту
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
                      Назва рецепту*
                    </label>
                    <Input
                      placeholder="e.g. Суші Райнбоу"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Опис
                    </label>
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
                      <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-6xl shadow-lg border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
                        {typeof formData.image === 'string' && formData.image.startsWith('data:') ? (
                          <img 
                            src={formData.image} 
                            alt="Recipe"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{typeof formData.image === 'string' && !formData.image.startsWith('data:') ? formData.image : '📷'}</span>
                        )}
                      </div>

                      {/* Upload Options */}
                      <div className="flex-1 space-y-3">
                        {/* File Input */}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({
                                    ...formData,
                                    image: reader.result as string,
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id="recipe-image-upload-edit"
                          />
                          <label
                            htmlFor="recipe-image-upload-edit"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800"
                          >
                            <Upload size={18} className="text-slate-600 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Завантажити фото
                            </span>
                          </label>
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
                                    ? "bg-blue-200 dark:bg-blue-900/50 scale-110"
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
                        Кухня*
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
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Чернетка</option>
                    <option value="published">Опубліковано</option>
                    <option value="archived">Архівовано</option>
                  </select>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Інгредієнти</h3>
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
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Інструкції</h3>
                <div className="space-y-3 mb-4">
                  {formData.instructions.map((instr, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
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
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Збереження...
                  </>
                ) : (
                  <>Зберегти зміни</>
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
