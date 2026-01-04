"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Star, Users, ArrowRight, Bookmark, Share2, Play, Zap, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
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

// Prace Uczniów (Pinterest style)
const studentWorks = [
  {
    id: "1",
    studentName: "Maria K.",
    courseName: 'Praca z kursu "Podstawy Nowoczesnej Kuchni"',
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=500&fit=crop",
    rating: 4.9,
    sheets: "5 karty",
    completedDate: "2024-11-05",
  },
  {
    id: "2",
    studentName: "Oleg P.",
    courseName: 'Praca z kursu "Nowoczesne Przepisy Autorskie"',
    imageUrl: "https://images.unsplash.com/photo-1553504653527-7dd5b39ef828?w=400&h=600&fit=crop",
    rating: 5.0,
    sheets: "3 karty",
    completedDate: "2024-11-03",
  },
];

// Strukturyzowane kursy
const courses: Course[] = [
  {
    id: 1,
    title: "⭐ Nowoczesna Kuchnia: Podstawy",
    description: "Naucz się pracować z produktami, krojeniem, obróbką termiczną i podaniem. Od pierwszych kroków — do nowoczesnego stylu gotowania.",
    difficulty: "Początkujący",
    duration: "4 godziny",
    lessons: 12,
    students: "250 uczniów",
    rating: 4.9,
    progress: 0,
  },
  {
    id: 2,
    title: "⭐ Food Pairing: Podstawy Połączeń Smaków",
    description: "Studium równowagi smaków, tekstury, temperatury i naucz się łączyć potrawy z koktajlami i napojami. Stwórz swoje pierwsze pary „zakąska + napój\".",
    difficulty: "Średniozaawansowany",
    duration: "3 godziny",
    lessons: 18,
    students: "180 uczniów",
    rating: 4.8,
    progress: 0,
  },
  {
    id: 3,
    title: "⭐ Nowoczesne Techniki i Potrawy Autorskie",
    description: "Masterclass Nowoczesnych Technik: Marynowanie, Emulsje, Fuzja-Techniki, Podanie i Praca z Teksturą. Idealnie dla tych, którzy chcą gotować w stylu premium-restauracji.",
    difficulty: "Zaawansowany",
    duration: "5 godzin",
    lessons: 24,
    students: "220 uczniów",
    rating: 5.0,
    progress: 0,
  },
];

const difficultyColors: Record<string, string> = {
  "Początkujący": "bg-green-100 text-green-700",
  "Średniozaawansowany": "bg-amber-100 text-amber-700",
  "Zaawansowany": "bg-purple-100 text-purple-700",
};

export default function CoursesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950 px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t.academy.courses.pageTitle}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.academy.courses.subtitle}
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500/20 border border-sky-400/50 rounded-full text-sky-300 font-semibold">
              <Star className="w-4 h-4 fill-current" />
              <span>3 kursy • 650+ uczniów</span>
            </div>
          </motion.div>
        </section>

        {/* Courses Grid */}
        <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => {
            const difficultyConfig: Record<string, { bg: string; badge: string }> = {
              "Początkujący": { bg: "from-green-400/20 to-emerald-400/20", badge: "bg-green-500/20 text-green-300 border border-green-500/50" },
              "Średniozaawansowany": { bg: "from-amber-400/20 to-orange-400/20", badge: "bg-amber-500/20 text-amber-300 border border-amber-500/50" },
              "Zaawansowany": { bg: "from-purple-400/20 to-pink-400/20", badge: "bg-purple-500/20 text-purple-300 border border-purple-500/50" },
            };
            const config = difficultyConfig[course.difficulty] || difficultyConfig["Początkujący"];

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
                <div className={`bg-gradient-to-br ${config.bg} rounded-2xl p-8 h-full border border-sky-300/40 shadow-lg hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 backdrop-blur-sm`}>
                  {/* Icon & Title */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {course.title}
                    </h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Level Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${config.badge}`}>
                      Poziom: {course.difficulty}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-sky-300/30">
                    <div className="flex items-center gap-3 text-gray-300 text-base">
                      <Clock className="w-5 h-5 flex-shrink-0 text-sky-400" />
                      <span>Czas Trwania: {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300 text-base">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      <span className="font-semibold">Ocena: {course.rating}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300 text-base">
                      <Users className="w-5 h-5 flex-shrink-0 text-sky-400" />
                      <span>Zaliczyło: {course.students}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/academy/courses/${course.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                    >
                      Rozpocznij Kurs
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
          className="text-4xl font-bold text-white mb-4 text-center"
        >
          Prace Uczniów
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-center text-gray-300 mb-12 text-lg"
        >
          Rzeczywiste Wyniki Studentów Modern Food Academy
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
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-900/40 border border-sky-300/40 backdrop-blur-sm">
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
                <div className="p-4 bg-gray-900/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{work.rating}</span>
                      <span className="text-sm text-gray-400 ml-2">• {work.sheets}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{work.studentName}</p>
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
          className="bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-500 backdrop-blur-sm rounded-3xl p-16 text-white text-center shadow-2xl border border-sky-500/50 mx-auto"
        >
          <h3 className="text-4xl font-bold mb-4">
            Gotów do Rozpoczęcia?
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Wybierz kurs i zacznij swoją podróż w nowoczesnej kuchni z Dima Fomin.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-sky-600 font-bold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Wybierz Kurs
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>
      </div>
    </div>
  );
}
