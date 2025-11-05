"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Plus, Trash2, Image as ImageIcon, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreateRecipePostData } from "@/lib/types";

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
    ingredients: [""],
    steps: [""],
    category: "",
    difficulty: "beginner",
    cookingTime: undefined,
    servings: undefined,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => (i === index ? value : item)),
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
    if (formData.ingredients.filter((i) => i.trim()).length === 0) {
      alert(community?.ingredientsRequired || "Додайте хоча б один інгредієнт");
      return;
    }
    if (formData.steps.filter((s) => s.trim()).length === 0) {
      alert(community?.stepsRequired || "Додайте хоча б один крок приготування");
      return;
    }

    setSubmitting(true);

    try {
      // Filter out empty ingredients and steps
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter((i) => i.trim()),
        steps: formData.steps.filter((s) => s.trim()),
      };

      await onSubmit(cleanedData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        ingredients: [""],
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                  🔥 {community?.difficultyLabel || "Складність"}
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
                >
                  <option value="beginner">{community?.beginner || "Початковий"}</option>
                  <option value="intermediate">{community?.intermediate || "Середній"}</option>
                  <option value="advanced">{community?.advanced || "Просунутий"}</option>
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
              <label className="block text-sm font-semibold text-[#1E1A41] mb-2">
                🥬 {community?.ingredientsLabel || "Інгредієнти"} *
              </label>
              <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder={`${community?.ingredient || "Інгредієнт"} ${index + 1}`}
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        onClick={() => removeIngredient(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addIngredient}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#3BC864] hover:text-[#3BC864] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {community?.addIngredient || "Додати інгредієнт"}
                </button>
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

            {/* Tokens Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4">
              <p className="text-sm text-amber-900">
                💰 <strong>{community?.earnTokensInfo || "Заробіть токени!"}</strong>{" "}
                {community?.earnTokensDesc || "За цей пост ви отримаєте 20 CT + бонуси за лайки та коментарі"}
              </p>
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
