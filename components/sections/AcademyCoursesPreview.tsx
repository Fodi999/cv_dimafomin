"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Star } from "lucide-react";
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
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-[#3BC864]/30"
            >
              {/* Course header with icon */}
              <div className="bg-gradient-to-br from-[#3BC864]/10 to-[#00D9FF]/10 p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#3BC864]/5 to-[#00D9FF]/5 transition-opacity" />
                <div className="text-6xl mb-4 relative z-10 group-hover:scale-110 transition-transform">
                  {course.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1E1A41] relative z-10">
                  {course.title}
                </h3>
              </div>

              {/* Course info */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                  {course.description}
                </p>

                {/* Meta info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${levelColors[course.level]}`}>
                      {course.level}
                    </span>
                    <span className="text-sm text-gray-600">⏱️ {course.duration}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      👥 {course.students} учеников
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/academy" className="block group/btn">
                  <Button className="w-full bg-[#3BC864] hover:bg-[#2da050] text-white font-bold py-3 rounded-xl transition-all group-hover/btn:shadow-lg">
                    Подробнее
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform ml-2" />
                  </Button>
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
          <Link href="/academy">
            <Button className="bg-gradient-to-r from-[#3BC864] to-[#2da050] hover:from-[#2da050] hover:to-[#1e7a38] text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group">
              Смотреть все курсы
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
