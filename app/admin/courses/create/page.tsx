"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Upload,
  Link as LinkIcon,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Check,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CourseStep {
  id: string;
  title: string;
  description: string;
  duration: number;
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

const steps = ["Основна інформація", "Відео та фото", "Етапи навчання", "Завершення"];

export default function CreateCoursePage() {
  const router = useRouter();
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
        duration: courseData.steps.reduce((sum, s) => sum + s.duration, 0) + parseInt(newStepDuration),
      });
      setNewStepTitle("");
      setNewStepDesc("");
      setNewStepDuration("5");
    }
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = courseData.steps.filter((s) => s.id !== stepId);
    const newDuration = updatedSteps.reduce((sum, s) => sum + s.duration, 0);
    setCourseData({
      ...courseData,
      steps: updatedSteps,
      duration: newDuration,
    });
  };

  const moveStep = (stepId: string, direction: "up" | "down") => {
    const index = courseData.steps.findIndex((s) => s.id === stepId);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < courseData.steps.length - 1)
    ) {
      const newSteps = [...courseData.steps];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      setCourseData({ ...courseData, steps: newSteps });
    }
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

    // Зберігаємо курс
    const newCourse = {
      id: String(Date.now()),
      ...courseData,
      status: "published",
      rating: 0,
      reviews: 0,
      students: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const savedCourses = localStorage.getItem("courses");
      const courses = savedCourses ? JSON.parse(savedCourses) : [];
      courses.unshift(newCourse);
      localStorage.setItem("courses", JSON.stringify(courses));
      console.log("✅ Курс створений:", newCourse.title);
      alert(
        `✅ Курс "${newCourse.title}" успішно опублікований!\n\nЕтапів: ${newCourse.steps.length}\nТривалість: ${newCourse.duration} хв`
      );
      router.push("/admin/courses");
    } catch (error) {
      console.error("❌ Помилка при збереженні:", error);
      alert("⚠️ Помилка при збереженні курсу");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950"
    >
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-500/5 via-sky-500/5 to-cyan-500/5 dark:from-sky-500/10 dark:via-sky-500/10 dark:to-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/5 via-cyan-500/5 to-sky-500/5 dark:from-cyan-500/10 dark:via-cyan-500/10 dark:to-sky-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/courses" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Повернутися до курсів</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={32} className="text-blue-600" />
            Новий курс навчання
          </h1>
          <div className="w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Steps */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Кроки створення</h3>
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      idx <= currentStep
                        ? idx === currentStep
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx <= currentStep
                            ? idx === currentStep
                              ? "bg-white text-blue-600"
                              : "bg-green-600 text-white"
                            : "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {idx < currentStep ? <Check size={14} /> : idx + 1}
                      </div>
                      <span className="text-sm font-medium">{step}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-6 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Прогрес
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-slate-200 dark:border-slate-700">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        Основна інформація про курс
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Назва курсу *
                      </label>
                      <Input
                        value={courseData.title}
                        onChange={(e) =>
                          setCourseData({ ...courseData, title: e.target.value })
                        }
                        placeholder="Наприклад: Як готувати суші як професіонал"
                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-lg"
                      />
                      {courseData.title && (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                          ✓ {courseData.title.length} символів
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Опис курсу *
                      </label>
                      <textarea
                        value={courseData.description}
                        onChange={(e) =>
                          setCourseData({ ...courseData, description: e.target.value })
                        }
                        placeholder="Детальний опис того, чого навчатиметься користувач..."
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white text-base"
                        rows={5}
                      />
                      {courseData.description && (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                          ✓ {courseData.description.length} символів
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
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
                          className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        >
                          <option value="easy">Легко 🟢</option>
                          <option value="medium">Середньо 🟡</option>
                          <option value="hard">Складно 🔴</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Орієнтовна тривалість (хв) *
                        </label>
                        <Input
                          type="number"
                          value={courseData.duration}
                          disabled
                          className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        />
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          Обчислюється автоматично на основі етапів
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Категорія
                      </label>
                      <Input
                        value={courseData.category}
                        onChange={(e) =>
                          setCourseData({ ...courseData, category: e.target.value })
                        }
                        placeholder="Наприклад: Кулінарія, Випічка, Десерти"
                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Теги (для пошуку)
                      </label>
                      <div className="flex gap-2 mb-3">
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
                          className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                        <Button
                          onClick={addTag}
                          className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                        >
                          Додати
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {courseData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 cursor-pointer hover:bg-blue-200 px-3 py-1"
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
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        Відео та фото
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <LinkIcon size={16} />
                        Посилання на YouTube відео
                      </label>
                      <Input
                        value={courseData.youtubeUrl}
                        onChange={(e) =>
                          setCourseData({ ...courseData, youtubeUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Вставте посилання на YouTube відео курсу
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <ImageIcon size={16} />
                        Обкладинка курсу
                      </label>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input
                            value={courseData.cover}
                            onChange={(e) =>
                              setCourseData({ ...courseData, cover: e.target.value })
                            }
                            placeholder="Вставте URL фото або еморджі 🎓"
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                          <Upload size={18} />
                        </Button>
                      </div>
                      {courseData.cover && (
                        <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-6xl">
                          {courseData.cover}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {courseData.images.map((image, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
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
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        Етапи навчання *
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Додайте пошагові інструкції. Кожен крок повинен мати назву, опис та
                        тривалість. Тривалість курсу буде обчислена автоматично.
                      </p>
                    </div>

                    {/* Add New Step Form */}
                    <Card className="p-6 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 space-y-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Додати новий крок
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Назва кроку
                        </label>
                        <Input
                          value={newStepTitle}
                          onChange={(e) => setNewStepTitle(e.target.value)}
                          placeholder="Наприклад: Підготовка інгредієнтів"
                          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
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
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
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
                            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={addStep}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <Plus size={16} className="mr-2" /> Додати крок
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Steps List */}
                    <div className="space-y-3">
                      {courseData.steps.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          Крока ще не додано
                        </p>
                      ) : (
                        <>
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                              {courseData.steps.length} {courseData.steps.length === 1 ? "крок" : "кроків"}
                            </span>
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                              ⏱️ {courseData.duration} хв всього
                            </span>
                          </div>

                          {courseData.steps.map((step, idx) => (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                                      {idx + 1}
                                    </span>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">
                                      {step.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {step.description}
                                  </p>
                                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                                    ⏱️ {step.duration} хв
                                  </Badge>
                                </div>

                                <div className="flex flex-col gap-2">
                                  {idx > 0 && (
                                    <Button
                                      onClick={() => moveStep(step.id, "up")}
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      ↑
                                    </Button>
                                  )}
                                  {idx < courseData.steps.length - 1 && (
                                    <Button
                                      onClick={() => moveStep(step.id, "down")}
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      ↓
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() => removeStep(step.id)}
                                    size="sm"
                                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                                    variant="outline"
                                  >
                                    <X size={14} />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </>
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
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Перевірка інформації про курс
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Переконайтеся, що всі дані вірні перед публікацією
                      </p>
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 space-y-6">
                      {/* Basic Info */}
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                          Основна інформація
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                              Назва курсу
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {courseData.title || "(не заповнено)"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                              Категорія
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {courseData.category}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
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
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                              Тривалість
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {courseData.duration} хв
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          Опис
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          {courseData.description || "(не заповнено)"}
                        </p>
                      </div>

                      {/* Tags */}
                      {courseData.tags.length > 0 && (
                        <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                            Теги ({courseData.tags.length})
                          </p>
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
                        </div>
                      )}

                      {/* Steps */}
                      <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          Етапи ({courseData.steps.length})
                        </p>
                        <div className="space-y-2">
                          {courseData.steps.map((step, idx) => (
                            <div key={step.id} className="text-sm">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {idx + 1}. {step.title}
                              </span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {" "}
                                ({step.duration} хв)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Media */}
                      {(courseData.youtubeUrl || courseData.images.length > 0) && (
                        <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                            Медіа
                          </p>
                          {courseData.youtubeUrl && (
                            <p className="text-sm text-blue-700 dark:text-blue-400 break-all mb-2">
                              🎥 {courseData.youtubeUrl}
                            </p>
                          )}
                          {courseData.images.length > 0 && (
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              🖼️ {courseData.images.length} фото
                            </p>
                          )}
                        </div>
                      )}
                    </Card>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-300">
                        ✅ Все готово! Курс буде опублікований і буде видно у розділі курсів.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="disabled:opacity-50"
                >
                  ← Назад
                </Button>

                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Крок {currentStep + 1}</span> з {steps.length}
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
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Далі →
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
