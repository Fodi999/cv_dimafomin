"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Users,
  Clock,
  TrendingUp,
  Play,
} from "lucide-react";
import Link from "next/link";

interface CourseStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  steps: CourseStep[];
  images: string[];
  youtubeUrl: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  rating: number;
  reviews: number;
  students: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Як готувати суші як професіонал",
    description: "Повний курс із навчанням готування різних видів суші від базових до складних техник",
    cover: "🍣",
    category: "Японська кухня",
    difficulty: "hard",
    duration: 180,
    steps: [
      { id: "s1", title: "Вибір рису та його підготовка", description: "Дізнайтеся як вибрати правильний рис", duration: 15 },
      { id: "s2", title: "Підготовка морепродуктів", description: "Правильна обробка та нарізання рибки", duration: 20 },
      { id: "s3", title: "Складання нігірі", description: "Техніка скупляння рису та рибки", duration: 25 },
      { id: "s4", title: "Скручування роллів", description: "Використання циновки та прийоми скручування", duration: 30 },
    ],
    images: ["🍣", "🥒", "🌶️"],
    youtubeUrl: "https://youtube.com/watch?v=example1",
    tags: ["суші", "японська", "морепродукти"],
    status: "published",
    rating: 4.9,
    reviews: 234,
    students: 1250,
    views: 5420,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Основи тіста та випічки",
    description: "Навчіться готувати різні види тіста та випічки від кулінара з 20-річним досвідом",
    cover: "🍰",
    category: "Випічка",
    difficulty: "medium",
    duration: 120,
    steps: [
      { id: "s1", title: "Типи тіста", description: "Дізнайтеся різниці між тістами", duration: 20 },
      { id: "s2", title: "Дріжджове тісто", description: "Класична техніка", duration: 40 },
      { id: "s3", title: "Ламістування", description: "Слистке тісто та круасани", duration: 50 },
    ],
    images: ["🍰", "🥐", "🧈"],
    youtubeUrl: "https://youtube.com/watch?v=example2",
    tags: ["випічка", "тісто", "десерти"],
    status: "published",
    rating: 4.7,
    reviews: 156,
    students: 890,
    views: 3240,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    title: "Паста: від теорії до практики",
    description: "Освойте мистецтво готування італійської пасти з нуля",
    cover: "🍝",
    category: "Італійська кухня",
    difficulty: "medium",
    duration: 90,
    steps: [
      { id: "s1", title: "Виготовлення пасти", description: "Традиційний рецепт яйця та борошна", duration: 30 },
      { id: "s2", title: "Види форм пасти", description: "Як робити різні форми", duration: 30 },
      { id: "s3", title: "Соуси до пасти", description: "Класичні італійські соуси", duration: 30 },
    ],
    images: ["🍝", "🍅", "🧄"],
    youtubeUrl: "https://youtube.com/watch?v=example3",
    tags: ["паста", "італійська", "соуси"],
    status: "draft",
    rating: 0,
    reviews: 0,
    students: 0,
    views: 0,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
];

const difficultyConfig = {
  easy: { label: "Легко", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  medium: { label: "Середньо", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" },
  hard: { label: "Складно", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" },
};

const statusConfig = {
  draft: { label: "Чернетка", color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
  published: { label: "Опубліковано", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  archived: { label: "Архівовано", color: "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300" },
};

export default function CoursesPage() {
  const [courses, setCourses] = useState(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Завантажуємо курси з localStorage при першому завантаженні
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      try {
        const parsedCourses = JSON.parse(savedCourses);
        const coursesWithDates = parsedCourses.map((course: any) => ({
          ...course,
          createdAt: new Date(course.createdAt),
          updatedAt: new Date(course.updatedAt),
        }));
        setCourses(coursesWithDates);
        setFilteredCourses(coursesWithDates);
        console.log(`✅ Завантажено ${coursesWithDates.length} курсів з localStorage`);
      } catch (error) {
        console.error("Помилка при завантаженні курсів:", error);
        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
      }
    } else {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
    }
  }, []);

  // Отримуємо унікальні категорії та статуси
  const categories = [...new Set(courses.map((c) => c.category))];
  const statuses = ["draft", "published", "archived"];

  // Фільтруємо курси
  const filterCourses = () => {
    let filtered = courses;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter((c) => c.status === selectedStatus);
    }

    setFilteredCourses(filtered);
  };

  // Обновляем фільтрацію при зміні параметрів
  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedCategory, selectedStatus]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status === selectedStatus ? "" : status);
  };

  const handleCreateCourse = (courseData: any) => {
    const newCourse: Course = {
      id: String(Date.now()),
      title: courseData.title,
      description: courseData.description,
      cover: courseData.cover || "📚",
      category: courseData.category,
      difficulty: courseData.difficulty,
      duration: courseData.duration,
      steps: courseData.steps,
      images: courseData.images,
      youtubeUrl: courseData.youtubeUrl,
      tags: courseData.tags,
      status: "published",
      rating: 0,
      reviews: 0,
      students: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedCourses = [newCourse, ...courses];
    setCourses(updatedCourses);
    setFilteredCourses(updatedCourses);

    // Зберігаємо в localStorage (без медіа-файлів - тільки посилання)
    const coursesToSave = updatedCourses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      cover: course.cover,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      steps: course.steps,
      images: course.images,
      youtubeUrl: course.youtubeUrl,
      tags: course.tags,
      status: course.status,
      rating: course.rating,
      reviews: course.reviews,
      students: course.students,
      views: course.views,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    }));

    try {
      localStorage.setItem("courses", JSON.stringify(coursesToSave));
      console.log("✅ Новий курс створений:", newCourse.title);
      alert(
        `✅ Курс "${newCourse.title}" успішно опублікований!\n\nЕтапів: ${newCourse.steps.length}\nТривалість: ${newCourse.duration} хв\n\n💾 Збережено в localStorage`
      );
    } catch (error) {
      console.error("⚠️ Помилка збереження курсу:", error);
      alert("⚠️ Курс створений, але не вдалося зберегти на диск");
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Ви впевнені, що хочете видалити цей курс?")) {
      const updatedCourses = courses.filter((c) => c.id !== id);
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);

      const coursesToSave = updatedCourses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        cover: course.cover,
        category: course.category,
        difficulty: course.difficulty,
        duration: course.duration,
        steps: course.steps,
        images: course.images,
        youtubeUrl: course.youtubeUrl,
        tags: course.tags,
        status: course.status,
        rating: course.rating,
        reviews: course.reviews,
        students: course.students,
        views: course.views,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
      }));

      try {
        localStorage.setItem("courses", JSON.stringify(coursesToSave));
        console.log("🗑️ Курс видален");
      } catch (error) {
        console.error("⚠️ Помилка при видаленні курсу:", error);
      }
    }
  };

  // Статистика
  const totalCourses = courses.length;
  const publishedCount = courses.filter((c) => c.status === "published").length;
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalViews = courses.reduce((sum, c) => sum + c.views, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <BookOpen size={32} className="text-blue-600" />
            Курси навчання
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Керуйте курсами та навчальними матеріалами
          </p>
        </div>

        <Link href="/admin/courses/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-colors"
          >
            <Plus size={20} />
            Новий курс
          </motion.button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 space-y-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Всього курсів</span>
            <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalCourses}</p>
        </Card>

        <Card className="p-6 space-y-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Опубліковано</span>
            <Eye size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{publishedCount}</p>
        </Card>

        <Card className="p-6 space-y-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Студентів</span>
            <Users size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalStudents}</p>
        </Card>

        <Card className="p-6 space-y-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Переглядів</span>
            <TrendingUp size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalViews}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Пошук курсів за назвою або тегами..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Filter size={16} />
            Категорія
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Статус</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedStatus === status
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {statusConfig[status as keyof typeof statusConfig].label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Вид:</span>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            Сітка
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            Список
          </button>
        </div>
      </Card>

      {/* Courses Grid or List */}
      {filteredCourses.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="overflow-hidden bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50 hover:shadow-lg transition-shadow h-full flex flex-col">
                  {/* Cover */}
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-6xl">
                    {course.cover}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">
                          {course.title}
                        </h3>
                      </div>
                      <Badge className={statusConfig[course.status].color}>
                        {statusConfig[course.status].label}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex gap-2 mb-3 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {course.duration} хв
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {course.students}
                      </span>
                    </div>

                    <div className="flex gap-1 mb-3">
                      {course.steps.length > 0 && (
                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs">
                          {course.steps.length} етапів
                        </Badge>
                      )}
                      <Badge className={difficultyConfig[course.difficulty].color}>
                        {difficultyConfig[course.difficulty].label}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Play size={14} className="mr-1" /> Переглянути
                      </Button>
                      <Button size="sm" variant="outline" className="px-3">
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    {/* Cover */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-3xl">
                      {course.cover}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">{course.title}</h3>
                        <Badge className={statusConfig[course.status].color}>
                          {statusConfig[course.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{course.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {course.duration} хв
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {course.students} студентів
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {course.views} переглядів
                        </span>
                        <Badge className={difficultyConfig[course.difficulty].color}>
                          {difficultyConfig[course.difficulty].label}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        <Play size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors"
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
        >
          <BookOpen size={48} className="text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Курсів не знайдено</h3>
          <p className="text-slate-600 dark:text-slate-400 text-center">
            Спробуйте змінити фільтри або створіть новий курс
          </p>
        </motion.div>
      )}

      {/* Course Wizard Modal */}
    </motion.div>
  );
}
