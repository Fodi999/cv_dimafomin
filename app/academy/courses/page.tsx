"use client";

import { motion } from "framer-motion";
import { Star, Clock, Users, ArrowRight, Fish, Shell, Utensils } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface StudentWork {
  id: string;
  studentName: string;
  courseName: string;
  imageUrl: string;
  rating: number;
  completedDate: string;
}

interface Course {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  color: string;
  gradient: string;
}

// Студенческие работы (Pinterest style)
const studentWorks: StudentWork[] = [
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
  {
    id: "3",
    studentName: "Анна Л.",
    courseName: "Секреты устриц",
    imageUrl: "https://images.unsplash.com/photo-1534080161776-9a095f3840d3?w=400&h=450&fit=crop",
    rating: 4.8,
    completedDate: "2024-11-02",
  },
  {
    id: "4",
    studentName: "Дмитро В.",
    courseName: "Суши и роллы",
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=550&fit=crop",
    rating: 5.0,
    completedDate: "2024-11-01",
  },
  {
    id: "5",
    studentName: "Ксенія М.",
    courseName: "Основы рыбы",
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=480&fit=crop",
    rating: 4.7,
    completedDate: "2024-10-31",
  },
  {
    id: "6",
    studentName: "Іван С.",
    courseName: "Секреты устриц",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=520&fit=crop",
    rating: 4.9,
    completedDate: "2024-10-30",
  },
];

// Структурированные курсы
const courses: Course[] = [
  {
    id: "1",
    icon: Fish,
    title: "Основы рыбы",
    description: "Научись выбирать, хранить и готовить рыбу как профессионал",
    level: "Начинающий",
    duration: "4 часа",
    rating: 4.9,
    students: 250,
    color: "from-sky-400 to-sky-600",
    gradient: "from-sky-50 to-sky-100 dark:from-sky-950/20 dark:to-sky-900/20",
  },
  {
    id: "2",
    icon: Shell,
    title: "Секреты устриц",
    description: "От открытия раковины до идеального сочетания со специями",
    level: "Средний",
    duration: "3 часа",
    rating: 4.8,
    students: 180,
    color: "from-cyan-400 to-cyan-600",
    gradient: "from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/20",
  },
  {
    id: "3",
    icon: Utensils,
    title: "Суши и роллы",
    description: "Мастер-класс по изготовлению суши как в токийских ресторанах",
    level: "Продвинутый",
    duration: "5 часов",
    rating: 5.0,
    students: 420,
    color: "from-teal-400 to-teal-600",
    gradient: "from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20",
  },
];

const difficultyColors: Record<string, string> = {
  "Начинающий": "bg-green-100 text-green-700",
  "Средний": "bg-yellow-100 text-yellow-700",
  "Продвинутый": "bg-red-100 text-red-700",
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 pt-24 pb-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Структурированные курсы
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            От базовых техник до advanced рецептов от шефа Dima Fomin
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 rounded-full text-sm font-semibold whitespace-nowrap">
            <Star className="w-4 h-4 fill-current" />
            <span>3 курса • 650+ учеников</span>
          </div>
        </motion.div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ translateY: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group cursor-pointer"
            >
              {/* Card */}
              <div className={`bg-gradient-to-br ${course.gradient} rounded-2xl p-6 h-full border-2 border-white shadow-lg hover:shadow-2xl transition-all duration-300`}>
                {/* Icon & Title */}
                <div className="mb-4">
                  <div className={`mb-3`}>
                    <course.icon className="w-16 h-16 text-sky-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Level Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[course.level]}`}>
                    {course.level}
                  </span>
                </div>

                {/* Meta Info */}
                <div className="space-y-2 mb-6 pb-6 border-b border-gray-300/50">
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>⏱️ {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Users className="w-4 h-4" />
                    <span>👥 {course.students.toLocaleString()} учеников</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href={`/academy/courses/${course.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r ${course.color} text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group`}
                  >
                    Начать курс
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Student Works - Pinterest Style */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold text-gray-900 mb-2 text-center"
        >
          Работы учеников
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-center text-gray-600 mb-12 text-lg"
        >
          Вдохновляющие творения наших студентов
        </motion.p>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {studentWorks.map((work, idx) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                {/* Image */}
                <div className="relative overflow-hidden h-auto">
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
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">{work.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(work.completedDate).toLocaleDateString("uk-UA", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{work.studentName}</p>
                  <p className="text-xs text-gray-500">{work.courseName}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-gradient-to-r from-sky-500 via-blue-500 to-teal-500 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Готов стать шефом?
          </h3>
          <p className="text-lg text-white/90 mb-8">
            Выбери курс и начни своё путешествие в мир морепродуктов вместе с Dima Fomin
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Выбрать курс
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
