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
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950">
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
            <Sparkles className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-semibold text-sky-600 dark:text-sky-400 leading-relaxed">Превью AI-наставника</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Поговори с AI-наставником
          </h2>
          <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
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
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-sky-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg dark:hover:shadow-sky-500/10 transition-all duration-200"
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center font-bold text-lg shadow-lg">
                <BrainCircuit className="w-6 h-6 text-sky-600 dark:text-sky-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">Dima Fomin AI</h3>
                <p className="text-sky-100 text-sm leading-relaxed">Онлайн сейчас</p>
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
                <div className="max-w-xs bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm dark:shadow-md border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                    Привет! Хочешь научиться готовить морепродукты как настоящий шеф?
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-3 font-medium">12:45</p>
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
                <div className="max-w-xs bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 p-4 rounded-2xl rounded-tr-none shadow-sm dark:shadow-md text-white">
                  <p className="text-base leading-relaxed font-medium">
                    Как готовить лосось как профессионал?
                  </p>
                  <p className="text-sky-100 text-xs mt-3 font-medium">12:46</p>
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
                <div className="max-w-xs bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm dark:shadow-md border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                    Лосось — это кладезь техник. Расскажу о температуре, сухой засолке и правильном сочетании с приправами. Начнём?
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-3 font-medium">12:47</p>
                </div>
              </motion.div>
            </div>

            {/* Chat input */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 flex gap-3">
              <input
                type="text"
                placeholder="Введи вопрос..."
                disabled
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 dark:text-gray-500 text-base focus:outline-none cursor-not-allowed font-medium border border-gray-100 dark:border-gray-700"
              />
              <button
                disabled
                className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-400 dark:text-gray-500 cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/create-chat">
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-medium px-10 py-6 text-lg rounded-xl shadow-md hover:shadow-lg dark:shadow-sky-500/20 dark:hover:shadow-sky-500/30 transition-all duration-200 active:scale-95 group">
                Начать разговор с AI
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
