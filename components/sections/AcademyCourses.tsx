"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Sparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-sky-500/20 transition-all duration-300"
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-5 flex items-center gap-3 border-b-2 border-gray-200 dark:border-gray-700">
              <Avatar className="w-12 h-12 ring-2 ring-sky-400/30">
                <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 text-white font-bold text-lg">
                  <BrainCircuit className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">Dima Fomin AI</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  Онлайн сейчас
                </p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-6 space-y-4 min-h-96 bg-white dark:bg-gray-900 flex flex-col justify-center">
              {/* AI Message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex gap-3 justify-start items-end"
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 text-white font-bold text-xs">DF</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 max-w-sm">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg rounded-tl-none">
                    <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed">
                      Привет! Хочешь научиться готовить морепродукты как настоящий шеф?
                    </p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs px-1">12:45</p>
                </div>
              </motion.div>

              {/* User Message */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-3 justify-end items-end"
              >
                <div className="flex flex-col gap-1 max-w-sm items-end">
                  <div className="bg-sky-500 dark:bg-sky-600 text-white p-4 rounded-lg rounded-tr-none shadow-sm">
                    <p className="text-sm leading-relaxed font-medium">
                      Как готовить лосось как профессионал?
                    </p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs px-1">12:46</p>
                </div>
              </motion.div>

              {/* AI Response */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex gap-3 justify-start items-end"
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 text-white font-bold text-xs">DF</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 max-w-sm">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg rounded-tl-none">
                    <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed">
                      Лосось — это кладезь техник. Расскажу о температуре, сухой засолке и правильном сочетании с приправами. Начнём?
                    </p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs px-1">12:47</p>
                </div>
              </motion.div>
            </div>

            {/* Chat input */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 flex gap-3">
              <input
                type="text"
                placeholder="Введи вопрос..."
                disabled
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-gray-600 dark:text-gray-400 text-sm focus:outline-none cursor-not-allowed font-medium border-2 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              />
              <button
                disabled
                className="px-5 py-3 bg-sky-500 text-white rounded-lg cursor-not-allowed opacity-60 hover:opacity-70 transition-opacity border-2 border-sky-500"
              >
                <MessageCircle className="w-5 h-5" />
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
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-medium px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg dark:shadow-sky-500/20 dark:hover:shadow-sky-500/30 transition-all duration-200 active:scale-95 group">
                Начать разговор с AI
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
