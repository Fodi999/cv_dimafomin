"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BrainCircuit, BookOpen, Coins } from "lucide-react";

export default function About() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-br from-neutral-50 via-sky-50/30 to-cyan-50/20 dark:from-neutral-900 dark:via-sky-950/20 dark:to-cyan-950/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              {t.about.title}
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-sky-500 to-cyan-400 mx-auto rounded-full" />
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-lg">Платформа для обучения, творчества и заработка</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="overflow-hidden shadow-2xl hover:shadow-2xl transition-shadow rounded-2xl">
                <img
                  src="https://i.postimg.cc/QNbFT95J/project-20200916-1843384-01.png"
                  alt={t.about.imageAlt}
                  className="w-full h-auto object-contain"
                />
              </Card>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {t.about.intro} <strong className="text-sky-600 dark:text-sky-400">{t.about.name}</strong>,{" "}
                {t.about.paragraph1}
              </p>

              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {t.about.paragraph2}
              </p>

              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {t.about.paragraph3}
              </p>

              <div className="pt-4">
                <Card className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 p-6 border-sky-200 dark:border-sky-800/50 shadow-lg rounded-xl">
                  <p className="text-base italic text-neutral-700 dark:text-neutral-300">
                    &ldquo;{t.about.quote}&rdquo;
                  </p>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: BrainCircuit,
                title: "AI-наставник",
                description: "Персональный помощник для обучения с использованием искусственного интеллекта",
                gradient: "from-sky-500 to-blue-600",
              },
              {
                icon: BookOpen,
                title: "Структурированные курсы",
                description: "Полный путь обучения от базовых навыков к продвинутым техникам",
                gradient: "from-cyan-500 to-teal-600",
              },
              {
                icon: Coins,
                title: "ChefTokens",
                description: "Зарабатывай и торгуй рецептами, создавай пассивный доход",
                gradient: "from-amber-500 to-orange-600",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="h-full bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-white/20 dark:border-neutral-700/20 rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${feature.gradient}`} />
                    <div className="p-8 space-y-4">
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
