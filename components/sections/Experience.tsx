"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    id: 1,
    restaurant: "Boulangerie Patisserie WAWEL",
    location: "Montreal, Canada",
    position: "Kucharz",
    period: "Grudzień 2022 - Sierpień 2023",
    description:
      "Praca w prestiżowej piekarni i cukierni. Przygotowanie wypieków i deserów według tradycyjnych receptur.",
    logo: "https://i.postimg.cc/50rx4NKK/IMG-2923.jpg",
  },
  {
    id: 2,
    restaurant: "Bar Charlemagne",
    location: "Agde, Francja",
    position: "Kucharz - Owoce morza",
    period: "Czerwiec 2022 - Listopad 2022",
    description:
      "Specjalizacja w przygotowywaniu świeżych owoców morza. Praca z najwyższej jakości produktami w restauracji nad morzem.",
    logo: "https://i.postimg.cc/pLB52zfr/IMG-3272.jpg",
  },
  {
    id: 3,
    restaurant: "FISH in HOUSE",
    location: "Dniepr, Ukraina",
    position: "Szef Kuchni",
    period: "Czerwiec 2018 - Czerwiec 2022",
    description:
      "Opracowywanie nowych produktów, kontrola jakości, zwiększanie trwałości produktów. Zakup urządzeń do procesów produkcyjnych, szkolenie personelu, HACCP, konfigurowanie procesów produkcyjnych.",
    logo: "https://i.postimg.cc/xdxkmQFz/IMG-3532.jpg",
  },
  {
    id: 4,
    restaurant: "Miód Malina",
    location: "Zgorzelec, Polska",
    position: "Kucharz",
    period: "Maj 2017 - Maj 2018",
    description:
      "Praca w autorskiej restauracji polskiej. Przygotowanie tradycyjnych i nowoczesnych dań kuchni polskiej.",
    logo: "https://i.postimg.cc/Gp2tdNhm/IMG-3877.jpg",
  },
  {
    id: 5,
    restaurant: "Restauracje międzynarodowe",
    location: "Litwa, Estonia, Niemcy",
    position: "Kucharz",
    period: "2003 - 2017",
    description:
      "Doświadczenie w różnych krajach europejskich. Praca z różnorodnymi kuchniami i kulturami kulinarnymi. Ukończenie szkoły zawodowej z wyróżnieniem.",
    logo: "https://i.postimg.cc/nVQsX6KX/IMG-3814.jpg",
  },
];

export default function Experience() {
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
              Doświadczenie
            </h2>
            <div className="w-20 h-1 bg-[#3BC864] mx-auto rounded-full mb-6" />
            <p className="text-lg text-[#240F24] max-w-2xl mx-auto">
              Międzynarodowa kariera w najlepszych restauracjach świata
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#C5E98A]" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
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
                          src={exp.logo}
                          alt={exp.restaurant}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-[#1E1A41] mb-1">
                            {exp.restaurant}
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
