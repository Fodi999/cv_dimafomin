"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Star, TrendingUp, Users, Sparkles, Fish, Shell, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyCoursesPreview() {
  const { t } = useLanguage();
  
  const courses = [
    {
      id: 1,
      title: t.academy.coursesPreview.course1.title,
      description: t.academy.coursesPreview.course1.description,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
      icon: Fish,
      level: t.academy.coursesPreview.course1.level,
      duration: t.academy.coursesPreview.course1.duration,
      rating: 4.9,
      students: 250,
      progress: 45,
    },
    {
      id: 2,
      title: t.academy.coursesPreview.course2.title,
      description: t.academy.coursesPreview.course2.description,
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
      icon: Shell,
      level: t.academy.coursesPreview.course2.level,
      duration: t.academy.coursesPreview.course2.duration,
      rating: 4.8,
      students: 180,
      progress: 60,
    },
    {
      id: 3,
      title: t.academy.coursesPreview.course3.title,
      description: t.academy.coursesPreview.course3.description,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
      icon: Utensils,
      level: t.academy.coursesPreview.course3.level,
      duration: t.academy.coursesPreview.course3.duration,
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

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-3xl" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
            <BookOpen className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {t.academy.coursesPreview.title}
          </h2>
          <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t.academy.coursesPreview.subtitle}
          </p>
        </motion.div>

        {/* Courses grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-10 mb-12"
        >
          {courses.map((course) => {
            const IconComponent = course.icon;
            return (
              <motion.div
                key={course.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 cursor-pointer"
              >
                {/* Pinterest-style image with overlay */}
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Rating badge - top right */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-4 right-4 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 shadow-lg z-20 flex items-center gap-1.5 backdrop-blur-md"
                  >
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{course.rating}</span>
                  </motion.div>

                  {/* Level badge - bottom left */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      course.level === t.academy.coursesPreview.beginner ? "bg-emerald-500/90 text-white" :
                      course.level === t.academy.coursesPreview.intermediate ? "bg-amber-500/90 text-white" :
                      "bg-rose-500/90 text-white"
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-5 space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta row - compact */}
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      {course.students}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.academy.coursesPreview.completed}</span>
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${course.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600"
                      />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href="/academy/courses" className="block pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 font-medium py-2.5 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600 flex items-center justify-center gap-2 text-sm"
                    >
                      {t.academy.coursesPreview.moreInfo}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
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
            <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-medium px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg dark:shadow-sky-500/20 dark:hover:shadow-sky-500/30 transition-all duration-200 active:scale-95 group">
              {t.academy.coursesPreview.viewAll}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
