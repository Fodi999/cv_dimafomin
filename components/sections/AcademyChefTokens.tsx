"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Coins, TrendingUp, Gift } from "lucide-react";
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
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00D9FF]/5 via-transparent to-[#3BC864]/5 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3BC864]/10 rounded-full blur-3xl" />

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
              className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-[#3BC864] via-[#00D9FF] to-blue-500 bg-clip-border"
            />

            {/* Token icons */}
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                💎
              </motion.div>
              <h3 className="text-3xl font-bold text-[#1E1A41] mb-2">ChefTokens</h3>
              <p className="text-gray-600 text-lg font-semibold">Твоя валюта мастерства</p>
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
                className="absolute text-4xl"
                style={{
                  top: `${30 + i * 20}%`,
                  left: `${20 + i * 30}%`,
                }}
              >
                🏆
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3BC864]/10 border border-[#3BC864]/30 mb-6">
                <Coins className="w-4 h-4 text-[#3BC864]" />
                <span className="text-sm font-semibold text-[#3BC864]">ChefTokens</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1A41] mb-6">
                Учись, готовь и зарабатывай
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 leading-relaxed"
            >
              💰 <span className="font-semibold">ChefTokens</span> — это уникальная система мотивации в Seafood Academy. Каждое действие приносит тебе токены:
            </motion.p>

            {/* Benefits */}
            <motion.div variants={containerVariants} className="space-y-4">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-white to-[#3BC864]/5 border-2 border-gray-100 hover:border-[#3BC864]/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#3BC864]/10 flex items-center justify-center text-[#3BC864]">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E1A41] mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 py-6 border-y border-gray-200"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3BC864]">50,000+</p>
                <p className="text-sm text-gray-600 mt-1">токенов в обороте</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3BC864]">1000+</p>
                <p className="text-sm text-gray-600 mt-1">активных пользователей</p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-[#3BC864] to-[#2da050] hover:from-[#2da050] hover:to-[#1e7a38] text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group w-full md:w-auto">
                  💰 Посмотреть баланс токенов
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
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
