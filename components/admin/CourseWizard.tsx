"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Check,
} from "lucide-react";

interface CourseStep {
  id: string;
  title: string;
  description: string;
  duration: number; // в минутах
}

interface CourseData {
  title: string;
  description: string;
  cover: string;
  youtubeUrl: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  category: string;
  tags: string[];
  steps: CourseStep[];
  images: string[];
}

interface CourseWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseData) => void;
}

const steps = ["Основна інформація", "Відео та фото", "Етапи навчання", "Завершення"];

export function CourseWizard({ isOpen, onClose, onSubmit }: CourseWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    cover: "",
    youtubeUrl: "",
    difficulty: "medium",
    duration: 30,
    category: "Кулінарія",
    tags: [],
    steps: [],
    images: [],
  });

  const [newTag, setNewTag] = useState("");
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");
  const [newStepDuration, setNewStepDuration] = useState("5");

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter((t) => t !== tag),
    });
  };

  const addStep = () => {
    if (newStepTitle.trim() && newStepDesc.trim()) {
      const newStep: CourseStep = {
        id: Date.now().toString(),
        title: newStepTitle.trim(),
        description: newStepDesc.trim(),
        duration: parseInt(newStepDuration) || 5,
      };
      setCourseData({
        ...courseData,
        steps: [...courseData.steps, newStep],
      });
      setNewStepTitle("");
      setNewStepDesc("");
      setNewStepDuration("5");
    }
  };

  const removeStep = (stepId: string) => {
    setCourseData({
      ...courseData,
      steps: courseData.steps.filter((s) => s.id !== stepId),
    });
  };

  const handleAddImage = () => {
    const newImage = `🖼️ Image ${courseData.images.length + 1}`;
    setCourseData({
      ...courseData,
      images: [...courseData.images, newImage],
    });
  };

  const handleRemoveImage = (index: number) => {
    setCourseData({
      ...courseData,
      images: courseData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    if (!courseData.title.trim()) {
      alert("Будь ласка, заповніть назву курсу");
      return;
    }
    if (!courseData.description.trim()) {
      alert("Будь ласка, заповніть опис курсу");
      return;
    }
    if (courseData.steps.length === 0) {
      alert("Будь ласка, додайте хоча б один крок навчання");
      return;
    }

    onSubmit(courseData);
    setCourseData({
      title: "",
      description: "",
      cover: "",
      youtubeUrl: "",
      difficulty: "medium",
      duration: 30,
      category: "Кулінарія",
      tags: [],
      steps: [],
      images: [],
    });
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Новий курс навчання</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Steps Indicator */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <motion.div key={idx} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      idx <= currentStep
                        ? "bg-purple-600 text-white"
                        : "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {idx < currentStep ? <Check size={18} /> : idx + 1}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      idx <= currentStep
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {step}
                  </span>
                  {idx < steps.length - 1 && (
                    <ChevronRight size={20} className="text-slate-400 mx-2 hidden sm:inline" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Step 1: Basic Info */}
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Основна інформація про курс
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Назва курсу *
                    </label>
                    <Input
                      value={courseData.title}
                      onChange={(e) =>
                        setCourseData({ ...courseData, title: e.target.value })
                      }
                      placeholder="Наприклад: Як готувати суші як професіонал"
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Опис курсу *
                    </label>
                    <textarea
                      value={courseData.description}
                      onChange={(e) =>
                        setCourseData({ ...courseData, description: e.target.value })
                      }
                      placeholder="Детальний опис того, чого навчатиметься користувач..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Складність
                      </label>
                      <select
                        value={courseData.difficulty}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            difficulty: e.target.value as "easy" | "medium" | "hard",
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="easy">Легко</option>
                        <option value="medium">Середньо</option>
                        <option value="hard">Складно</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Тривалість (хв) *
                      </label>
                      <Input
                        type="number"
                        value={courseData.duration}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            duration: parseInt(e.target.value) || 30,
                          })
                        }
                        min="5"
                        max="480"
                        className="bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Категорія
                    </label>
                    <Input
                      value={courseData.category}
                      onChange={(e) =>
                        setCourseData({ ...courseData, category: e.target.value })
                      }
                      placeholder="Наприклад: Кулінарія, Випічка, Десерти"
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Теги (для пошуку)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Додайте тег та натисніть Enter"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        className="bg-slate-50 dark:bg-slate-800"
                      />
                      <Button
                        onClick={addTag}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Додати
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {courseData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 cursor-pointer hover:bg-purple-200"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Video & Photos */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Відео та фото
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <LinkIcon size={16} />
                      Посилання на YouTube відео
                    </label>
                    <Input
                      value={courseData.youtubeUrl}
                      onChange={(e) =>
                        setCourseData({ ...courseData, youtubeUrl: e.target.value })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Вставте посилання на YouTube відео курсу
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <ImageIcon size={16} />
                      Обкладинка курсу
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={courseData.cover}
                        onChange={(e) =>
                          setCourseData({ ...courseData, cover: e.target.value })
                        }
                        placeholder="Вставте URL фото або еморджі 🎓"
                        className="bg-slate-50 dark:bg-slate-800"
                      />
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Upload size={18} />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <ImageIcon size={16} />
                        Додаткові фото для етапів
                      </label>
                      <Button
                        onClick={handleAddImage}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus size={14} /> Додати фото
                      </Button>
                    </div>

                    {courseData.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {courseData.images.map((image, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
                          >
                            {image}
                            <button
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Course Steps */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Етапи навчання *
                  </h3>

                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Додайте пошагові інструкції для вашого курсу. Кожен крок повинен мати назву, опис та приблизну тривалість.
                    </p>
                  </Card>

                  <div className="space-y-3 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Назва кроку
                      </label>
                      <Input
                        value={newStepTitle}
                        onChange={(e) => setNewStepTitle(e.target.value)}
                        placeholder="Наприклад: Підготовка інгредієнтів"
                        className="bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Опис кроку
                      </label>
                      <textarea
                        value={newStepDesc}
                        onChange={(e) => setNewStepDesc(e.target.value)}
                        placeholder="Детальний опис цього кроку навчання..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Тривалість (хв)
                        </label>
                        <Input
                          type="number"
                          value={newStepDuration}
                          onChange={(e) => setNewStepDuration(e.target.value)}
                          min="1"
                          max="120"
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={addStep}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Plus size={16} className="mr-1" /> Додати крок
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-2">
                    {courseData.steps.length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                        Крока ще не додано. Додайте хоча б один крок навчання.
                      </p>
                    ) : (
                      courseData.steps.map((step, idx) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                  Крок {idx + 1}
                                </span>
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  {step.title}
                                </h4>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                {step.description}
                              </p>
                              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                ⏱️ {step.duration} хв
                              </Badge>
                            </div>
                            <button
                              onClick={() => removeStep(step.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Summary */}
              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Перевірка інформації про курс
                  </h3>

                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Назва
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {courseData.title || "(не заповнено)"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Категорія
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {courseData.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Складність
                        </p>
                        <Badge
                          className={
                            courseData.difficulty === "easy"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : courseData.difficulty === "medium"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }
                        >
                          {courseData.difficulty === "easy"
                            ? "Легко"
                            : courseData.difficulty === "medium"
                            ? "Середньо"
                            : "Складно"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Тривалість
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {courseData.duration} хв
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Опис
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        {courseData.description || "(не заповнено)"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Теги ({courseData.tags.length})
                      </p>
                      {courseData.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {courseData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400">
                          Теги не додані
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Етапи ({courseData.steps.length})
                      </p>
                      {courseData.steps.length > 0 ? (
                        <div className="space-y-1">
                          {courseData.steps.map((step, idx) => (
                            <p key={step.id} className="text-sm text-slate-700 dark:text-slate-300">
                              {idx + 1}. {step.title} ({step.duration} хв)
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400">
                          Етапи не додані
                        </p>
                      )}
                    </div>

                    {courseData.youtubeUrl && (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          YouTube видео
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 break-all">
                          {courseData.youtubeUrl}
                        </p>
                      </div>
                    )}

                    {courseData.images.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Фото ({courseData.images.length})
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {courseData.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="aspect-square rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg"
                            >
                              {img}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="disabled:opacity-50"
            >
              ← Назад
            </Button>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              Крок {currentStep + 1} з {steps.length}
            </div>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check size={18} className="mr-2" />
                Опублікувати курс
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Далі →
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
