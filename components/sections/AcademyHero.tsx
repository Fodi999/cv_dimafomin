"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyHero() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-32 pb-16">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950 dark:from-gray-950 dark:via-sky-950 dark:to-cyan-950 z-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Animated wave pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
            fill="rgba(15, 118, 180, 0.1)"
            className="animate-pulse"
          />
          <path
            d="M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="rgba(34, 211, 238, 0.05)"
            className="animate-pulse delay-700"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 text-left">
        {/* Inner container with max-width */}
        <div className="w-full max-w-6xl">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-sky-500/20 border border-sky-400/50 mb-4 sm:mb-6 md:mb-8 dark:bg-sky-500/20 dark:border-sky-600/50"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-sky-300 dark:text-sky-300" />
          <span className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
            {t.hero.badge}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-400">
                {t.hero.headingLine1}
              </span>
              <br />
              <span className="text-white">{t.hero.headingLine2}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-400">
                {t.hero.headingLine3}
              </span>
              <br />
              <span className="text-white">{t.hero.headingLine4}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
                {t.hero.headingLine4Continuation}
              </span>
            </h1>
          </div>
        </motion.div>

        {/* Subtitle - Project description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-medium mb-3 sm:mb-4 md:mb-6 max-w-3xl leading-relaxed"
        >
          {t.hero.platformDescription}
        </motion.p>

        {/* AI Mentor description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-4 sm:mb-6 max-w-3xl leading-relaxed"
        >
          {t.hero.aiMentorDescription}
        </motion.p>

        {/* CTA phrase */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl md:text-2xl font-semibold text-sky-300 mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed"
        >
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-10 sm:mb-16 md:mb-20"
        >
          <Link href="/academy" className="group w-full sm:w-auto">
            <Button className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-white hover:border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 w-full">
              {t.hero.startLearning}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>

          <Link href="/create-chat" className="group w-full sm:w-auto">
            <Button className="bg-black text-white hover:bg-gray-900 border-2 border-white font-medium px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 w-full">
              {t.hero.startDialog}
              <Waves className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto mt-8 sm:mt-12 md:mt-20"
        >
          {[
            { number: t.hero.stats.recipes, label: t.hero.stats.recipesLabel },
            { number: t.hero.stats.students, label: t.hero.stats.studentsLabel },
            { number: t.hero.stats.support, label: t.hero.stats.supportLabel },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-sky-300/40 dark:border-sky-600/40 shadow-md dark:shadow-sky-500/5 hover:shadow-lg dark:hover:shadow-sky-500/10 hover:border-sky-300/60 dark:hover:border-sky-500/60 transition-all duration-200"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300 dark:from-sky-300 dark:to-cyan-300 mb-1 sm:mb-2">
                {stat.number}
              </p>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 dark:text-gray-500 tracking-wide font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 sm:bottom-12 md:bottom-20 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 sm:w-8 sm:h-12 border-2 border-sky-400 dark:border-sky-400 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-sky-400 dark:bg-sky-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
