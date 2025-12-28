"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowRight,
  Brain,
  Camera,
  Lightbulb,
  Zap,
  Sparkles,
  BookOpen,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyAbout() {
  const { t } = useLanguage();
  
  // Mentor traits data with translations
  const mentorTraits = [
    { icon: Brain, title: t.academy.about.mentorTrait1.title, desc: t.academy.about.mentorTrait1.desc },
    { icon: Camera, title: t.academy.about.mentorTrait2.title, desc: t.academy.about.mentorTrait2.desc },
  ];
  
  // Capabilities data with translations
  const capabilities = [
    { icon: <Sparkles className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: t.academy.about.capability1.title, desc: t.academy.about.capability1.desc },
    { icon: <BookOpen className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: t.academy.about.capability2.title, desc: t.academy.about.capability2.desc },
    { icon: <Camera className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: t.academy.about.capability3.title, desc: t.academy.about.capability3.desc },
    { icon: <Lightbulb className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: t.academy.about.capability4.title, desc: t.academy.about.capability4.desc },
    { icon: <Zap className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: t.academy.about.capability5.title, desc: t.academy.about.capability5.desc },
    { icon: <Clock className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: t.academy.about.capability6.title, desc: t.academy.about.capability6.desc },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-cyan-500/5 dark:via-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-24">
        {/* SECTION 1: HERO BLOCK - О ПРОЕКТЕ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-4"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t.academy.about.projectTitle}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {t.academy.about.projectDescription}
            </p>
          </motion.div>
        </motion.div>

        {/* SECTION 2: КТО ТАКОЙ AI DIMA FOMIN */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-xl border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 p-8 md:p-12"
        >
          <motion.div variants={itemVariants} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
              <Brain className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">{t.academy.about.aiMentorTitle}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t.academy.about.aiMentorSubtitle}
            </h3>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {t.academy.about.aiMentorDesc}
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {mentorTraits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="p-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200"
                  >
                    <Icon className="w-8 h-8 text-sky-600 dark:text-sky-400 mb-4" />
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">{item.title}</h4>
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* SECTION 3: AI-НАСТАВНИК - ФУНКЦИОНАЛЬНЫЕ ВОЗМОЖНОСТИ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {t.academy.about.capabilitiesTitle}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t.academy.about.capabilitiesSubtitle}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {capabilities.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-gradient-to-br from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 hover:shadow-lg dark:hover:shadow-sky-500/10 transition-all duration-200"
              >
                <div className="text-sky-600 dark:text-sky-400 mb-3">{item.icon}</div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* SECTION 7: FINAL CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-gradient-to-r from-sky-500/10 to-cyan-500/10 dark:from-sky-900/30 dark:to-cyan-900/30 rounded-xl border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 p-8 md:p-12 text-center"
        >
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {t.academy.about.ctaTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-semibold uppercase tracking-wide">
              {t.academy.about.ctaSubtitle}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {t.academy.about.ctaDescription}
            </p>
            <Link href="/assistant">
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-medium px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg dark:shadow-sky-500/20 dark:hover:shadow-sky-500/30 transition-all duration-200 active:scale-95 group">
                {t.academy.about.ctaButton}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
