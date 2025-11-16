"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, TrendingUp, Award, Zap, Target, GraduationCap, Trophy, Coins, Globe, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyPage() {
  const { t } = useLanguage();

  const iconsMap = [GraduationCap, Target, Coins, Users, BarChart3, Trophy];

  const advantages = t.academy.advantages.items.map((item, idx) => ({
    icon: iconsMap[idx],
    title: item.title,
    description: item.description,
  }));

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full pt-32 pb-32"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-400/50 mb-8"
            >
              <span className="text-sm font-semibold text-white">
                {t.academy.hero.badge}
              </span>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
            >
              {t.academy.hero.mainTitle}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl leading-relaxed"
            >
              {t.academy.hero.mainDescription}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-3xl"
            >
              {[
                { number: t.academy.stats.recipes, label: t.academy.stats.recipesLabel },
                { number: t.academy.stats.students, label: t.academy.stats.studentsLabel },
                { number: t.academy.stats.support, label: t.academy.stats.supportLabel },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-sky-300/40 text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm md:text-base text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link href="/academy/courses" className="group">
                <Button className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3 rounded-lg border-2 border-white transition-all w-full sm:w-auto">
                  {t.academy.hero.startButton}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
              </Link>
              <Link href="/chat/create-chat" className="group">
                <Button className="bg-black text-white hover:bg-gray-900 border-2 border-white font-medium px-8 py-3 rounded-lg transition-all w-full sm:w-auto">
                  {t.academy.hero.aiButton}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Direction Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full py-20 bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t.academy.direction.title}
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t.academy.direction.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: t.academy.direction.courses.title,
                  description: t.academy.direction.courses.description,
                  link: t.academy.direction.courses.link,
                },
                {
                  icon: Users,
                  title: t.academy.direction.community.title,
                  description: t.academy.direction.community.description,
                  link: t.academy.direction.community.link,
                },
                {
                  icon: TrendingUp,
                  title: t.academy.direction.leaderboard.title,
                  description: t.academy.direction.leaderboard.description,
                  link: t.academy.direction.leaderboard.link,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  >
                    <Link href={item.link}>
                      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all cursor-pointer border border-sky-300/40 hover:border-sky-300/60 h-full">
                        <Icon className="w-12 h-12 text-sky-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Advantages Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full py-20 bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 text-center"
            >
              {t.academy.advantages.title}
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advantages.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.08 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all border border-sky-300/40 hover:border-sky-300/60"
                  >
                    <Icon className="w-10 h-10 text-sky-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full py-20 bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-sky-600/80 via-cyan-600/80 to-sky-500/80 backdrop-blur-sm rounded-2xl p-12 md:p-16 text-white text-center shadow-2xl border border-sky-500/50">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                {t.academy.hero.readyTitle}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-lg text-white/90 mb-12 leading-relaxed"
              >
                {t.academy.hero.readyDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Link href="/academy/courses" className="group">
                  <Button className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3 rounded-lg border-2 border-white transition-all w-full sm:w-auto">
                    {t.academy.hero.startButton}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                  </Button>
                </Link>
                <Link href="/chat/create-chat" className="group">
                  <Button className="bg-black text-white hover:bg-gray-900 border-2 border-white font-medium px-8 py-3 rounded-lg transition-all w-full sm:w-auto">
                    {t.academy.hero.aiButton}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
