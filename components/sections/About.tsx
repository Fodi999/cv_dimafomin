"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";

export default function About() {
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
              O mnie
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
                  alt="Dima Fomin at work"
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
                Jestem <strong className="text-[#1E1A41]">Dmytro (Dima) Fomin</strong>,
                profesjonalnym szefem kuchni z{" "}
                <strong className="text-[#1E1A41]">
                  ponad 20-letnim doświadczeniem
                </strong>{" "}
                w tworzeniu autentycznych japońskich potraw i pracy w najlepszych restauracjach świata.
              </p>

              <p className="text-lg text-[#240F24] leading-relaxed">
                Moją pasję do sztuki kulinarnej rozwijałem pracując w renomowanych
                restauracjach w <strong className="text-[#1E1A41]">Polsce, Litwie, Estonii, 
                Niemczech, Francji i Kanadzie</strong>, gdzie doskonaliłem techniki 
                tradycyjne i nowoczesne podejście do prezentacji.
              </p>

              <p className="text-lg text-[#240F24] leading-relaxed">
                Każde danie, które tworzę, to połączenie{" "}
                <strong className="text-[#1E1A41]">precyzji</strong>,{" "}
                <strong className="text-[#1E1A41]">świeżości składników</strong>{" "}
                i <strong className="text-[#1E1A41]">estetyki</strong>. Jestem celowy, 
                towarzyski, odporny na stres i pomysłowy. Specjalizuję się w opracowywaniu 
                nowych produktów i szkoleniu zespołów.
              </p>

              <div className="pt-4">
                <Card className="bg-[#FEF9F5] p-6 border-none shadow-lg">
                  <p className="text-base italic text-[#240F24]">
                    &ldquo;Moja filozofia: szacunek do tradycji, pasja do
                    innowacji i niekończąca się dążenie do doskonałości w
                    każdym kawałku. Wiem dużo o produktach i nieustannie się rozwijam.&rdquo;
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
