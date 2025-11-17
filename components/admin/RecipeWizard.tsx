"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Plus,
  Trash2,
  ChefHat,
  Upload,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Youtube,
} from "lucide-react";
import { QuickTemplates } from "./QuickTemplates";
import { RecipeTemplate, generateRandomRecipe } from "@/lib/recipe-templates";

interface RecipeFormData {
  name: string;
  description: string;
  images: string[];
  youtubeUrl: string;
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

interface RecipeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: RecipeFormData) => void;
}

const cuisineOptions = ["Японська", "Італійська", "Українська", "Таїландська", "Американська", "Китайська", "Французька"];
const unitOptions = ["г", "мл", "чайна ложка", "столова ложка", "чашка", "шт"];

export function RecipeWizard({ isOpen, onClose, onSubmit }: RecipeWizardProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: "",
    description: "",
    images: [],
    youtubeUrl: "",
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
  const [currentPhase, setCurrentPhase] = useState<"description" | "photos" | "video">("description");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Валидация описания
  const validateDescriptionPhase = (): boolean => {
    return (
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.cuisine !== ""
    );
  };

  // Валидация фото
  const validatePhotosPhase = (): boolean => {
    return formData.images.length > 0;
  };

  // Валидация видео
  const validateVideoPhase = (): boolean => {
    return formData.youtubeUrl.trim() !== "" && validateYoutubeUrl(formData.youtubeUrl);
  };

  const handleNextPhase = () => {
    if (currentPhase === "description") {
      if (validateDescriptionPhase()) {
        setCurrentPhase("photos");
      } else {
        alert("Будь ласка, заповніть назву, опис та виберіть кухню");
      }
    } else if (currentPhase === "photos") {
      if (validatePhotosPhase()) {
        setCurrentPhase("video");
      } else {
        alert("Будь ласка, додайте хоча б одне фото");
      }
    }
  };

  const handlePrevPhase = () => {
    if (currentPhase === "photos") {
      setCurrentPhase("description");
    } else if (currentPhase === "video") {
      setCurrentPhase("photos");
    }
  };

  const handleAddImage = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий. Максимальний розмір 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, reader.result as string],
      }));
    };
    reader.onerror = () => {
      alert("Помилка при завантаженні файлу");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
    return youtubeRegex.test(url);
  };

  const extractYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
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
    if (formData.images.length === 0) {
      errors.push("Фото (мінімум 1)");
    }
    if (!formData.youtubeUrl.trim()) {
      errors.push("YouTube посилання");
    } else if (!validateYoutubeUrl(formData.youtubeUrl)) {
      errors.push("YouTube посилання невалідне");
    }

    if (errors.length > 0) {
      alert(`Будь ласка, заповніть обов'язкові поля:\n• ${errors.join("\n• ")}`);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      images: [],
      youtubeUrl: "",
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
    setCurrentPhase("description");
  };

  const handleLoadTemplate = (template: RecipeTemplate) => {
    setFormData({
      name: template.name,
      description: template.description,
      images: template.image ? [template.image] : [],
      youtubeUrl: "",
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

  const parseRecipeFromDescription = () => {
    const lines = formData.description.split('\n').filter(line => line.trim());
    const ingredients: Array<{ name: string; quantity: number; unit: string }> = [];
    const instructions: string[] = [];
    
    let inIngredientsSection = false;
    let inInstructionsSection = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect sections
      if (trimmed.toLowerCase().includes('ингредиент') || trimmed.toLowerCase().includes('інградієнт')) {
        inIngredientsSection = true;
        inInstructionsSection = false;
        continue;
      }
      
      if (trimmed.toLowerCase().includes('приготовлени') || trimmed.toLowerCase().includes('по шагам') || trimmed.toLowerCase().includes('крок')) {
        inIngredientsSection = false;
        inInstructionsSection = true;
        continue;
      }
      
      // Parse ingredients
      if (inIngredientsSection && trimmed && !trimmed.includes('*')) {
        // Try to parse: "Name — quantity unit" or "Name — quantity–quantity unit"
        const match = trimmed.match(/^([^—]+)—\s*([\d,–\-.\s]+)\s*([а-яґєіїцљюабвгдежзийклмнопрстуфхцчшщъьюяabcdefghijklmnopqrstuvwxyzгм]+)?/i);
        
        if (match) {
          const name = match[1].trim();
          let quantity = parseFloat(match[2].replace(/[–\-]/g, '-').split('-')[0].replace(',', '.')) || 0;
          const unit = (match[3] || 'г').trim().toLowerCase();
          
          if (name && quantity > 0) {
            ingredients.push({ name, quantity, unit });
          }
        }
      }
      
      // Parse instructions
      if (inInstructionsSection && trimmed) {
        // Skip numbered items like "1.", "2.", etc
        const instructionMatch = trimmed.match(/^\d+\.\s*(.+)/);
        const cleanInstruction = instructionMatch ? instructionMatch[1] : trimmed;
        
        if (cleanInstruction && !cleanInstruction.includes('*')) {
          instructions.push(cleanInstruction);
        }
      }
    }
    
    // Update form data with parsed data
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ...ingredients],
      instructions: [...prev.instructions, ...instructions],
    }));
    
    // Only show alert if manually clicked
    if (ingredients.length > 0 || instructions.length > 0) {
      console.log(`✅ Розпарсено: ${ingredients.length} інгредієнтів, ${instructions.length} кроків`);
    }
  };

  const getPhaseProgress = () => {
    if (currentPhase === "description") return 33;
    if (currentPhase === "photos") return 66;
    return 100;
  };

  const getPhaseIcon = (phase: "description" | "photos" | "video") => {
    if (phase === "description") return "📝";
    if (phase === "photos") return "📸";
    return "🎥";
  };

  const isDescriptionValid = validateDescriptionPhase();
  const isPhotosValid = validatePhotosPhase();
  const isVideoValid = validateVideoPhase();

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
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ChefHat size={28} />
                  Креативний рецепт
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Фаза {currentPhase === "description" ? "1" : currentPhase === "photos" ? "2" : "3"} з 3
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4 pb-2 flex-shrink-0">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={false}
                  animate={{ width: `${getPhaseProgress()}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full"
                />
              </div>
            </div>

            {/* Phase Indicators */}
            <div className="px-6 pb-6 flex-shrink-0 flex gap-3">
              <button
                onClick={() => setCurrentPhase("description")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  currentPhase === "description"
                    ? "bg-purple-600 text-white shadow-lg"
                    : isDescriptionValid
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="text-lg">{getPhaseIcon("description")}</span> Опис
                {isDescriptionValid && currentPhase !== "description" && <Check size={14} />}
              </button>

              <button
                onClick={() => currentPhase !== "description" && setCurrentPhase("photos")}
                disabled={!isDescriptionValid}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  currentPhase === "photos"
                    ? "bg-purple-600 text-white shadow-lg"
                    : isPhotosValid
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="text-lg">{getPhaseIcon("photos")}</span> Фото
                {isPhotosValid && currentPhase !== "photos" && <Check size={14} />}
              </button>

              <button
                onClick={() => (currentPhase !== "description" && isPhotosValid) && setCurrentPhase("video")}
                disabled={!isPhotosValid}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  currentPhase === "video"
                    ? "bg-purple-600 text-white shadow-lg"
                    : isVideoValid
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="text-lg">{getPhaseIcon("video")}</span> Відео
                {isVideoValid && currentPhase !== "video" && <Check size={14} />}
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              <AnimatePresence mode="wait">
                {currentPhase === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Назва */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Назва рецепту <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g. Суші Райнбоу"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    {/* Опис */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Опис <span className="text-red-500">*</span>
                        </label>
                        <Button
                          onClick={parseRecipeFromDescription}
                          disabled={!formData.description.trim()}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                          🤖 Генерація
                        </Button>
                      </div>
                      <textarea
                        placeholder="Детальний опис рецепту..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        onBlur={() => {
                          // Auto-parse if description is long and has ingredients/instructions keywords
                          if (
                            formData.description.length > 200 &&
                            !formData.ingredients.length &&
                            !formData.instructions.length &&
                            (formData.description.toLowerCase().includes('ингредиент') ||
                              formData.description.toLowerCase().includes('приготовлени'))
                          ) {
                            parseRecipeFromDescription();
                          }
                        }}
                        rows={4}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Кухня та Складність */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Кухня <span className="text-red-500">*</span>
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

                    {/* Info about parsing */}
                    {formData.ingredients.length > 0 || formData.instructions.length > 0 ? (
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-900 dark:text-green-300">
                          ✅ Розпарсено: {formData.ingredients.length} інгредієнтів, {formData.instructions.length} кроків
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                          💡 Скопіюйте текст рецепту в описання і натисніть кнопку "Генерація" щоб автоматично заповнити інгредієнти та кроки
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentPhase === "photos" && (
                  <motion.div
                    key="photos"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="text-4xl">📸</span>
                        Фотографії рецепту
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                        Додавайте фото рецепту по мірі потреби. Перше фото буде основним.
                      </p>
                    </div>

                    {/* Photo Gallery */}
                    {formData.images.length > 0 && (
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Завантажені фото <span className="text-xs text-slate-600 dark:text-slate-400">({formData.images.length})</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {formData.images.map((image, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={image}
                                alt={`Фото ${idx + 1}`}
                                className="w-full aspect-square rounded-lg object-cover shadow-md"
                              />
                              {idx === 0 && (
                                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                                  Основне
                                </div>
                              )}
                              <button
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAddImage(file);
                        }}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex items-center justify-center gap-3 px-6 py-8 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800"
                      >
                        <Upload size={32} className="text-slate-600 dark:text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-300">Додайте фото</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">JPG, PNG, WebP • Макс 5MB</p>
                        </div>
                      </label>
                    </div>

                    {/* Info */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-300">
                        💡 Першу фотографію можна буде розпізнати як основну. Клієнти спочатку бачитимуть цю фотографію!
                      </p>
                    </div>
                  </motion.div>
                )}

                {currentPhase === "video" && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="text-4xl">🎥</span>
                        YouTube відео рецепту
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                        Додайте посилання на YouTube відео з вашим рецептом
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* YouTube URL Input */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          YouTube посилання <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <Youtube size={20} className="text-red-600" />
                          <Input
                            placeholder="https://youtube.com/watch?v=..."
                            value={formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            className="flex-1 bg-slate-50 dark:bg-slate-800"
                          />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                          Приклади: youtube.com/watch?v=... або youtu.be/...
                        </p>
                      </div>

                      {/* Preview */}
                      {formData.youtubeUrl && validateYoutubeUrl(formData.youtubeUrl) && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                            <Check size={16} /> Посилання валідне
                          </p>
                          <div className="aspect-video w-full bg-slate-800 rounded-lg overflow-hidden">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${extractYoutubeId(formData.youtubeUrl)}`}
                              title="Recipe Video"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      )}

                      {formData.youtubeUrl && !validateYoutubeUrl(formData.youtubeUrl) && (
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                          <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-900 dark:text-red-300">
                            Це посилання не виглядає як YouTube. Будь ласка, перевірте і спробуйте знову.
                          </p>
                        </div>
                      )}

                      {/* Info */}
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                          💡 Відео допомагає клієнтам краще зрозуміти рецепт. Люди більше довіряють рецептам з відео!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
              <Button
                onClick={handlePrevPhase}
                disabled={currentPhase === "description"}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
              >
                <ChevronLeft size={18} />
                Назад
              </Button>

              {currentPhase !== "video" ? (
                <Button
                  onClick={handleNextPhase}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2"
                >
                  Далі
                  <ChevronRight size={18} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isVideoValid}
                  className={`flex-1 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                    formData.status === "published"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Публікація...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      {formData.status === "published" ? "Опублікувати" : "Зберегти"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
