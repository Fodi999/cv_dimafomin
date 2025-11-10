"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, BookOpen, BrainCircuit, Coins, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyAbout() {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-cyan-500/5 dark:via-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
                <Brain className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">О проекте</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Искусственный интеллект в сервисе кулинара
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              <span className="font-bold bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">AI Dima Fomin</span> — это не просто искусственный интеллект.
              <br />
              <br />
              Это <span className="bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent font-semibold">цифровой наставник</span>, который передаёт знания, опыт и философию шефа.
              Каждый рецепт, совет и техника — результат многолетнего мастерства.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              {[
                { icon: <BookOpen className="w-6 h-6" />, title: "Обучение", desc: "Структурированные курсы от базовых техник до advanced рецептов" },
                { icon: <BrainCircuit className="w-6 h-6" />, title: "AI-наставник", desc: "Генерируй рецепты, получай советы, анализируй результаты" },
                { icon: <Coins className="w-6 h-6" />, title: "ChefTokens", desc: "Зарабатывай токены за учёбу и обмени их на эксклюзивные рецепты" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-sky-50/40 to-cyan-50/40 dark:from-sky-950/30 dark:to-cyan-950/30 hover:from-sky-50/60 hover:to-cyan-50/60 dark:hover:from-sky-950/50 dark:hover:to-cyan-950/50 transition-all border border-sky-200/50 dark:border-sky-800/50 backdrop-blur-sm group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/academy">
                <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg dark:shadow-sky-500/20 hover:shadow-xl dark:hover:shadow-sky-500/30 transition-all group w-full md:w-auto">
                  Подробнее об Академии
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side - Visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 dark:from-sky-900/30 dark:to-cyan-900/30 rounded-2xl border-2 border-sky-200/50 dark:border-sky-800/50 backdrop-blur-sm p-8 flex items-center justify-center shadow-lg dark:shadow-sky-500/10">
              <motion.div
                animate={{ float: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 flex items-center justify-center shadow-lg dark:shadow-cyan-500/30">
                  <Waves className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Морские продукты с нуля
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">
                  От выбора ингредиентов до идеального блюда с помощью AI
                </p>
              </motion.div>

              {/* Floating icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl"
              >
                <div className="absolute top-4 right-4 w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-cyan-500/30">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="absolute bottom-4 left-4 w-14 h-14 bg-gradient-to-br from-cyan-500 to-sky-500 dark:from-cyan-600 dark:to-sky-600 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-sky-500/30">
                  <Coins className="w-6 h-6" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
