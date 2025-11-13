"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Coins, TrendingUp, Gift, Gem, Award, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyChefTokens() {
  const benefits = [
    {
      icon: <Coins className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      title: "Зарабатывай",
      description: "Проходи уроки, учись активно — получай токены",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      title: "Оплата запросов к AI",
      description: "Каждый запрос к AI списывает небольшое количество токенов",
    },
    {
      icon: <Gift className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      title: "Обменивай",
      description: "Эксклюзивные рецепты, мастер-классы, личные разборы",
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
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              ChefTokens — твоя валюта мастерства
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              ChefTokens — это валюта обучения в Seafood Academy. Зарабатывайте, тратьте и обменивайте.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div variants={containerVariants} className="grid sm:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-gradient-to-br from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 hover:shadow-lg dark:hover:shadow-sky-500/10 transition-all duration-200"
              >
                <div className="text-sky-600 dark:text-sky-400 mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="grid sm:grid-cols-3 gap-6"
          >
            {[
              { icon: <TrendingUp className="w-6 h-6 text-sky-600 dark:text-sky-400" />, stat: "50,000+", label: "токенов в обороте" },
              { icon: <Users className="w-6 h-6 text-sky-600 dark:text-sky-400" />, stat: "1000+", label: "активных пользователей" },
              { icon: <Zap className="w-6 h-6 text-sky-600 dark:text-sky-400" />, stat: "24/7", label: "доступность" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-6 rounded-xl bg-white/40 dark:bg-white/5 border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 text-center hover:shadow-lg dark:hover:shadow-sky-500/10 transition-all"
              >
                <div className="text-sky-600 dark:text-sky-400 flex justify-center mb-3">{item.icon}</div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{item.stat}</p>
                <p className="text-base text-gray-600 dark:text-gray-400 font-medium">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-4"
          >
            <Link href="/profile">
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-medium px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg dark:shadow-sky-500/20 dark:hover:shadow-sky-500/30 transition-all active:scale-95 group w-full md:w-auto flex items-center justify-center gap-2">
                <Coins className="w-5 h-5" />
                Посмотреть баланс токенов
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
