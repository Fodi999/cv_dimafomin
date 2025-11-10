"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Star, TrendingUp } from "lucide-react";
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
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D9FF]/5 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#3BC864]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3BC864]/10 border border-[#3BC864]/30 mb-6">
            <BookOpen className="w-4 h-4 text-[#3BC864]" />
            <span className="text-sm font-semibold text-[#3BC864]">Курсы Академии</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1A41] mb-4">
            Структурированные курсы
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
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
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-neutral-200 hover:border-sky-300"
            >
              {/* Course header with icon and rating overlay */}
              <div className="relative bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-teal-500/20 p-8 text-center overflow-hidden h-48 flex items-center justify-center">
                {/* Animated background */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-sky-500/30 to-cyan-500/20 transition-opacity"
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
                  className="absolute top-4 right-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-3 shadow-lg z-20 flex items-center gap-1"
                >
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="font-bold text-white text-sm">{course.rating}</span>
                </motion.div>
              </div>

              {/* Course info */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <h3 className="text-2xl font-bold text-neutral-900">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-600 leading-relaxed text-sm">
                  {course.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-700">Пройдено</span>
                    <span className="font-bold text-sky-600">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${course.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Meta info */}
                <div className="space-y-3 py-3 border-t border-b border-neutral-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${{
                      "Начинающий": "bg-emerald-100 text-emerald-700",
                      "Средний": "bg-amber-100 text-amber-700",
                      "Продвинутый": "bg-rose-100 text-rose-700",
                    }[course.level]}`}>
                      {course.level}
                    </span>
                    <span className="text-neutral-600 flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      {course.duration}
                    </span>
                  </div>

                  {/* Students count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 text-xs">👥 {course.students.toLocaleString()} учеников</span>
                    <motion.span 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="text-sky-500"
                    >
                      ✨
                    </motion.span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/academy/courses" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
            <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group">
              Смотреть все курсы
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
