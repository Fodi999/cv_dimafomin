"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Sparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyAIMentor() {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.3 },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">Превью AI-наставника</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Поговори с AI-наставником
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Получай советы в реальном времени, генерируй рецепты и совершенствуй свое мастерство
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto"
        >
          {/* Chat window */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-sky-500/10 border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center font-bold text-lg shadow-lg">
                <BrainCircuit className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Dima Fomin AI</h3>
                <p className="text-sky-100 text-sm">Онлайн сейчас</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-6 space-y-6 min-h-96 bg-gradient-to-b from-white to-sky-50/30 dark:from-gray-900 dark:to-gray-900 flex flex-col justify-center">
              {/* AI Message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
                  DF
                </div>
                <div className="max-w-xs bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                    👋 Привет! Хочешь научиться готовить морепродукты как настоящий шеф?
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">12:45</p>
                </div>
              </motion.div>

              {/* User Message */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-4 justify-end"
              >
                <div className="max-w-xs bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 p-4 rounded-2xl rounded-tr-none shadow-md dark:shadow-lg text-white">
                  <p className="text-sm leading-relaxed">
                    Да! Я хочу научиться готовить устрицы 🦪
                  </p>
                  <p className="text-sky-100 text-xs mt-2">12:46</p>
                </div>
              </motion.div>

              {/* AI Response */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
                  DF
                </div>
                <div className="max-w-xs bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                    🦪 Отлично! Устрицы требуют минимальной обработки, но максимального внимания к качеству. Начнем?
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">12:47</p>
                </div>
              </motion.div>
            </div>

            {/* Chat input */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 flex gap-3">
              <input
                type="text"
                placeholder="Введи вопрос..."
                disabled
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-400 dark:text-gray-500 text-sm focus:outline-none cursor-not-allowed"
              />
              <button
                disabled
                className="px-4 py-3 bg-gray-200 dark:bg-gray-800 rounded-xl text-gray-400 dark:text-gray-500 cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/create-chat">
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg dark:shadow-sky-500/20 hover:shadow-xl dark:hover:shadow-sky-500/30 transition-all group">
                💬 Начать разговор с AI
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
