"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Star, TrendingUp, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyCoursesPreview() {
  const courses = [
    {
      id: 1,
      title: "Основы рыбы",
      description: "Научись выбирать, хранить и готовить рыбу как профессионал",
      icon: "🐟",
      level: "Начинающий",
      duration: "4 часа",
      rating: 4.9,
      students: 250,
      progress: 45,
    },
    {
      id: 2,
      title: "Секреты устриц",
      description: "От открытия раковины до идеального сочетания со специями",
      icon: "🦪",
      level: "Средний",
      duration: "3 часа",
      rating: 4.8,
      students: 180,
      progress: 60,
    },
    {
      id: 3,
      title: "Суши и роллы",
      description: "Мастер-класс по изготовлению суши как в токийских ресторанах",
      icon: "🍣",
      level: "Продвинутый",
      duration: "5 часов",
      rating: 5.0,
      students: 420,
      progress: 30,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const levelColors: Record<string, string> = {
    "Начинающий": "bg-green-100 text-green-700",
    "Средний": "bg-orange-100 text-orange-700",
    "Продвинутый": "bg-red-100 text-red-700",
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
            <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">Курсы Академии</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Структурированные курсы
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            От базовых техник до advanced рецептов от шефа Dima Fomin
          </p>
        </motion.div>

        {/* Courses grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg dark:shadow-sky-500/10 hover:shadow-2xl dark:hover:shadow-sky-500/20 transition-all border border-gray-200 dark:border-gray-800 hover:border-sky-300 dark:hover:border-sky-500/50"
            >
              {/* Course header with icon and rating overlay */}
              <div className="relative bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-teal-500/20 dark:from-sky-900/40 dark:via-cyan-900/30 dark:to-teal-900/40 p-8 text-center overflow-hidden h-48 flex items-center justify-center">
                {/* Animated background */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-sky-500/30 to-cyan-500/20 dark:from-sky-500/40 dark:to-cyan-500/30 transition-opacity"
                  animate={{ scale: [1, 1.05] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Icon */}
                <motion.div
                  className="text-7xl relative z-10"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring" }}
                >
                  {course.icon}
                </motion.div>

                {/* Rating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-full p-3 shadow-lg dark:shadow-orange-500/40 z-20 flex items-center gap-1"
                >
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="font-bold text-white text-sm">{course.rating}</span>
                </motion.div>
              </div>

              {/* Course info */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {course.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Пройдено</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${course.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Meta info */}
                <div className="space-y-3 py-3 border-t border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${{
                      "Начинающий": "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
                      "Средний": "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
                      "Продвинутый": "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400",
                    }[course.level]}`}>
                      {course.level}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      {course.duration}
                    </span>
                  </div>

                  {/* Students count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()} учеников
                    </span>
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="text-sky-500 dark:text-cyan-400"
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/academy/courses" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-bold py-3 rounded-xl transition-all shadow-md dark:shadow-sky-500/20 hover:shadow-lg dark:hover:shadow-sky-500/30 flex items-center justify-center gap-2"
                  >
                    Подробнее
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* See all courses button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/academy/courses">
            <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg dark:shadow-sky-500/20 hover:shadow-xl dark:hover:shadow-sky-500/30 transition-all group">
              Смотреть все курсы
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
