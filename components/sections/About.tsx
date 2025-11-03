"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" className="py-24 px-4 bg-[#C5E98A]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4">
              {t.about.title}
            </h2>
            <div className="w-20 h-1 bg-[#240F24] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="overflow-hidden shadow-xl">
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
              <p className="text-lg text-[#240F24] leading-relaxed">
                {t.about.intro} <strong className="text-[#1E1A41]">{t.about.name}</strong>,{" "}
                {t.about.paragraph1}
              </p>

              <p className="text-lg text-[#240F24] leading-relaxed">
                {t.about.paragraph2}
              </p>

              <p className="text-lg text-[#240F24] leading-relaxed">
                {t.about.paragraph3}
              </p>

              <div className="pt-4">
                <Card className="bg-[#FEF9F5] p-6 border-none shadow-lg">
                  <p className="text-base italic text-[#240F24]">
                    &ldquo;{t.about.quote}&rdquo;
                  </p>
                </Card>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
