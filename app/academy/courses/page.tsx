"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Star, Users, ArrowRight, Bookmark, Share2, Play, Zap, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  rating: number;
  students: string;
  progress: number;
  lessons: number;
}

// Студенческие работы (Pinterest style)
const studentWorks = [
  {
    id: "1",
    studentName: "Мария К.",
    courseName: "Основы рыбы",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=500&fit=crop",
    rating: 4.9,
    completedDate: "2024-11-05",
  },
  {
    id: "2",
    studentName: "Олег П.",
    courseName: "Суши и роллы",
    imageUrl: "https://images.unsplash.com/photo-1553504653527-7dd5b39ef828?w=400&h=600&fit=crop",
    rating: 5.0,
    completedDate: "2024-11-03",
  },
];

// Структурированные курсы
const courses: Course[] = [
  {
    id: 1,
    title: "Основы рыбы",
    description: "Научись выбирать, хранить и готовить рыбу как профессионал",
    difficulty: "Начинающий",
    duration: "4 часа",
    lessons: 12,
    students: "250 учеников",
    rating: 4.9,
    progress: 0,
  },
  {
    id: 2,
    title: "Техники нарезки",
    description: "Овладей основными техниками нарезки: угри, квадрат и диагональ",
    difficulty: "Средний",
    duration: "6 часов",
    lessons: 18,
    students: "180 учеников",
    rating: 4.8,
    progress: 0,
  },
  {
    id: 3,
    title: "Advanced рецепты",
    description: "Создавай авторские суши-рецепты и удивляй гостей",
    difficulty: "Advanced",
    duration: "8 часов",
    lessons: 24,
    students: "220 учеников",
    rating: 5.0,
    progress: 0,
  },
];

const difficultyColors: Record<string, string> = {
  "Начинающий": "bg-green-100 text-green-700",
  "Средний": "bg-amber-100 text-amber-700",
  "Advanced": "bg-purple-100 text-purple-700",
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-[40px] pt-[80px] pb-[40px]">
      {/* Header */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Структурированные курсы
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            От базовых техник до advanced рецептов от шефа Dima Fomin
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-sky-100/50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 rounded-full font-semibold">
            <Star className="w-4 h-4 fill-current" />
            <span>3 курса • 650+ учеников</span>
          </div>
        </motion.div>
      </section>

      {/* Courses Grid */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => {
            const difficultyConfig: Record<string, { bg: string; badge: string }> = {
              "Начинающий": { bg: "from-green-400/20 to-emerald-400/20", badge: "bg-green-100 text-green-700" },
              "Средний": { bg: "from-amber-400/20 to-orange-400/20", badge: "bg-amber-100 text-amber-700" },
              "Advanced": { bg: "from-purple-400/20 to-pink-400/20", badge: "bg-purple-100 text-purple-700" },
            };
            const config = difficultyConfig[course.difficulty] || difficultyConfig["Начинающий"];

            return (
                <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ translateY: -8 }}
                className="group"
              >
                {/* Card */}
                <div className={`bg-gradient-to-br ${config.bg} rounded-2xl p-8 h-full border border-sky-200/50 dark:border-sky-800/50 shadow-lg hover:shadow-xl transition-all duration-300`}>
                  {/* Icon & Title */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {course.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Level Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.badge}`}>
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-300/50 dark:border-gray-600/50">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-base">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-base">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      <span className="font-semibold">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-base">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>{course.students}</span>
                    </div>
                  </div>

                  {/* Progress Bar (if applicable) */}
                  {course.progress > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Прогресс</span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{course.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ delay: idx * 0.1 + 0.4, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-sky-500 to-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link href={`/academy/courses/${course.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                    >
                      Начать курс
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Student Works - Pinterest Style */}
      <section className="mt-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center"
        >
          Работы учеников
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg"
        >
          Вдохновляющие творения наших студентов
        </motion.p>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {studentWorks.map((work, idx) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={work.imageUrl}
                    alt={work.studentName}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h4 className="text-white font-bold text-lg">{work.studentName}</h4>
                    <p className="text-white/90 text-sm">{work.courseName}</p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900 dark:text-white">{work.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(work.completedDate).toLocaleDateString("uk-UA", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{work.studentName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{work.courseName}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-500 dark:from-sky-600 dark:via-cyan-600 dark:to-sky-500 rounded-3xl p-16 text-white text-center shadow-2xl dark:shadow-sky-500/20 mx-auto"
        >
          <h3 className="text-4xl font-bold mb-4">
            Готов стать шефом?
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Выбери курс и начни своё путешествие в мир морепродуктов вместе с Dima Fomin
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-sky-600 font-bold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Выбрать курс
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
