"use client";

import { motion } from "framer-motion";
import { Star, Clock, Users, CheckCircle2, Download, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface CourseDetail {
  id: string;
  title: string;
  icon: string;
  description: string;
  fullDescription: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  lessons: Lesson[];
  skills: string[];
  requirements: string[];
  color: string;
}

const coursesData: Record<string, CourseDetail> = {
  "1": {
    id: "1",
    icon: "🐟",
    title: "Основы рыбы",
    description: "Научись выбирать, хранить и готовить рыбу как профессионал",
    fullDescription:
      "Полный курс по работе с рыбой: от выбора качественного продукта на рыбном рынке до приготовления изысканных блюд. Вы научитесь различать виды рыбы, правильно её чистить, хранить и готовить различными способами.",
    level: "Начинающий",
    duration: "4 часа",
    rating: 4.9,
    students: 250,
    color: "from-blue-400 to-blue-600",
    lessons: [
      { id: 1, title: "Введение в мир рыбы", duration: "20 мин", completed: true },
      { id: 2, title: "Выбор и хранение рыбы", duration: "35 мин", completed: true },
      { id: 3, title: "Техники чистки рыбы", duration: "45 мин", completed: false },
      { id: 4, title: "Варка и припускание", duration: "40 мин", completed: false },
      { id: 5, title: "Жарка и гриль", duration: "50 мин", completed: false },
      { id: 6, title: "Финальный проект", duration: "30 мин", completed: false },
    ],
    skills: [
      "Выбор качественной рыбы",
      "Правильное хранение",
      "Филетирование и чистка",
      "Базовые техники готовки",
      "Сочетание с соусами",
    ],
    requirements: ["Базовые навыки готовки", "Острый нож", "Доска для нарезки"],
  },
  "2": {
    id: "2",
    icon: "🦪",
    title: "Секреты устриц",
    description: "От открытия раковины до идеального сочетания со специями",
    fullDescription:
      "Откройте мир устриц! Узнайте как правильно выбрать, открыть и подать устриц. Изучите различные сорта, методы приготовления и идеальные сочетания с винами и специями.",
    level: "Средний",
    duration: "3 часа",
    rating: 4.8,
    students: 180,
    color: "from-orange-400 to-orange-600",
    lessons: [
      { id: 1, title: "История и виды устриц", duration: "25 мин", completed: true },
      { id: 2, title: "Как открыть устрицу", duration: "30 мин", completed: true },
      { id: 3, title: "Свежесть и качество", duration: "35 мин", completed: false },
      { id: 4, title: "Соусы и приправы", duration: "40 мин", completed: false },
      { id: 5, title: "Подача и презентация", duration: "25 мин", completed: false },
    ],
    skills: [
      "Открытие устриц",
      "Определение свежести",
      "Создание соусов",
      "Правильная подача",
      "Парирование с вином",
    ],
    requirements: ["Устричный нож", "Кольцо для устриц", "Хорошее освещение"],
  },
  "3": {
    id: "3",
    icon: "🍣",
    title: "Суши и роллы",
    description: "Мастер-класс по изготовлению суши как в токийских ресторанах",
    fullDescription:
      "Станьте мастером суши! Научитесь готовить рис правильно, скручивать роллы как в Токио и создавать красивые сочетания. От классических роллов до современных вариаций.",
    level: "Продвинутый",
    duration: "5 часов",
    rating: 5.0,
    students: 420,
    color: "from-red-400 to-red-600",
    lessons: [
      { id: 1, title: "История суши", duration: "20 мин", completed: true },
      { id: 2, title: "Рис для суши (Сумеши)", duration: "45 мин", completed: true },
      { id: 3, title: "Техника скручивания", duration: "60 мин", completed: true },
      { id: 4, title: "Классические роллы", duration: "50 мин", completed: false },
      { id: 5, title: "Творческие вариации", duration: "55 мин", completed: false },
      { id: 6, title: "Нигири и сашими", duration: "40 мин", completed: false },
      { id: 7, title: "Финальный шедевр", duration: "30 мин", completed: false },
    ],
    skills: [
      "Приготовление сумеши",
      "Скручивание роллов",
      "Нарезка рыбы",
      "Создание дизайна",
      "Правильная подача",
    ],
    requirements: [
      "Коврик для суши",
      "Острый нож",
      "Рис для суши",
      "Норі (водоросли)",
    ],
  },
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = coursesData[courseId];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Курс не найден</h1>
          <Link href="/academy/courses" className="text-blue-600 hover:underline">
            Вернуться к курсам
          </Link>
        </div>
      </div>
    );
  }

  const completedLessons = course.lessons.filter((l) => l.completed).length;
  const progress = Math.round((completedLessons / course.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 pt-24 pb-16">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <Link href="/academy/courses">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад к курсам
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start gap-6 mb-8"
        >
          <div className={`text-7xl`}>{course.icon}</div>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">{course.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{course.fullDescription}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 bg-yellow-50 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{course.rating}</span>
                <span className="text-gray-600">({course.students.toLocaleString()} учеников)</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-gray-700">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{course.duration}</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 font-semibold">
                {course.level}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Прогресс обучения</h3>
              <span className="text-2xl font-bold text-sky-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.3, duration: 1 }}
                className={`h-3 rounded-full bg-gradient-to-r ${course.color}`}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Завершено {completedLessons} из {course.lessons.length} уроков
            </p>
          </motion.div>

          {/* Lessons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Уроки</h3>
            <div className="space-y-3">
              {course.lessons.map((lesson, idx) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05, duration: 0.5 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                    lesson.completed
                      ? "bg-green-50 border-green-300"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900">{lesson.title}</h4>
                        <p className="text-sm text-gray-600">{lesson.duration}</p>
                      </div>
                    </div>
                    {!lesson.completed && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r ${course.color} hover:shadow-lg transition-all`}
                      >
                        Начать
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Что ты изучишь</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.skills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                  className="flex items-start gap-3 p-4 bg-sky-50 rounded-xl"
                >
                  <CheckCircle2 className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-800 font-medium">{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Requirements */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Требования</h4>
            <ul className="space-y-3">
              {course.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-sky-600 font-bold mt-1">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 rounded-xl bg-gradient-to-r ${course.color} text-white font-bold shadow-lg hover:shadow-xl transition-all text-lg`}
          >
            Продолжить обучение
          </motion.button>

          {/* Share */}
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-3">
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg font-semibold text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" />
              Поделиться курсом
            </button>
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors">
              <Download className="w-5 h-5" />
              Скачать сертификат
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
