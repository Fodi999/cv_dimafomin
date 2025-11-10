"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Coins, TrendingUp, Gift, Gem, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyChefTokens() {
  const benefits = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Зарабатывай",
      description: "Получай ChefTokens за прохождение курсов, создание рецептов и участие в сообществе",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Расти",
      description: "Повышай свой уровень, разблокируй новые возможности и становись экспертом",
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Обменивай",
      description: "Обмени токены на эксклюзивные рецепты, мастер-классы и персональные консультации",
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
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 hidden md:flex items-center justify-center"
          >
            {/* Animated token circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 dark:from-sky-600 dark:via-cyan-600 dark:to-blue-600 bg-clip-border"
            />

            {/* Token icons */}
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6 flex justify-center"
              >
                <Gem className="w-16 h-16 text-amber-500 dark:text-amber-400" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ChefTokens</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">Твоя валюта мастерства</p>
            </div>

            {/* Floating tokens */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.8,
                  repeat: Infinity,
                }}
                className="absolute"
                style={{
                  top: `${30 + i * 20}%`,
                  left: `${20 + i * 30}%`,
                }}
              >
                <Award className="w-10 h-10 text-amber-400 dark:text-amber-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
                <Coins className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">ChefTokens</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Учись, готовь и зарабатывай
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed flex items-center gap-2"
            >
              <Coins className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <span><span className="font-semibold">ChefTokens</span> — это уникальная система мотивации в Seafood Academy. Каждое действие приносит тебе токены:</span>
            </motion.p>

            {/* Benefits */}
            <motion.div variants={containerVariants} className="space-y-4">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-sky-50/40 to-cyan-50/40 dark:from-sky-950/30 dark:to-cyan-950/30 border-2 border-sky-200/50 dark:border-sky-800/50 hover:border-sky-400 dark:hover:border-sky-500/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 py-6 border-y border-gray-200 dark:border-gray-800"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">50,000+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">токенов в обороте</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">1000+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">активных пользователей</p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg dark:shadow-sky-500/20 hover:shadow-xl dark:hover:shadow-sky-500/30 transition-all group w-full md:w-auto flex items-center justify-center gap-2">
                  <Coins className="w-5 h-5" />
                  Посмотреть баланс токенов
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
