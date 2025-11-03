"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const experienceLogos = [
  "https://i.postimg.cc/50rx4NKK/IMG-2923.jpg",
  "https://i.postimg.cc/pLB52zfr/IMG-3272.jpg",
  "https://i.postimg.cc/xdxkmQFz/IMG-3532.jpg",
  "https://i.postimg.cc/Gp2tdNhm/IMG-3877.jpg",
  "https://i.postimg.cc/nVQsX6KX/IMG-3814.jpg",
];

export default function Experience() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="experience" className="py-24 px-4 bg-[#FEF9F5]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4">
              {t.experience.title}
            </h2>
            <div className="w-20 h-1 bg-[#3BC864] mx-auto rounded-full mb-6" />
            <p className="text-lg text-[#240F24] max-w-2xl mx-auto">
              {t.experience.subtitle}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#C5E98A]" />

            <div className="space-y-12">
              {t.experience.items.map((exp: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`md:flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="md:w-1/2 mb-8 md:mb-0">
                    <Card
                      className={`p-6 hover:shadow-xl transition-shadow duration-300 bg-white border-[#E0D8D0] ${
                        index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={experienceLogos[index]}
                          alt={exp.company}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-[#1E1A41] mb-1">
                            {exp.company}
                          </h3>
                          <p className="text-lg font-semibold text-[#3BC864] mb-2">
                            {exp.position}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-[#2B6A79]">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#2B6A79]">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{exp.period}</span>
                        </div>
                      </div>

                      <p className="text-[#240F24] leading-relaxed">
                        {exp.description}
                      </p>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-[#3BC864] rounded-full border-4 border-[#FEF9F5] shadow-lg" />
                  </div>

                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
