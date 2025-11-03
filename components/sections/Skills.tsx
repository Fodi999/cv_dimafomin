"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ChefHat,
  Fish,
  Utensils,
  Award,
  Users,
  Shield,
  GraduationCap,
  Laptop,
  FileText,
} from "lucide-react";

const getSkillsData = () => [
  {
    icon: Fish,
    titleIndex: 0,
    level: 95,
    details: [
      "Profesjonalne krojenie sashimi zgodne z japońskimi standardami",
      "Znajomość ponad 20 gatunków ryb i owoców morza",
      "Tradycyjne techniki przygotowania: ikejime, sujihiki",
      "Rozpoznawanie świeżości produktów i odpowiedni dobór temperatury",
      "Tworzenie artystycznych kompozycji nigiri z perfekcyjnym balansem smaku",
    ],
  },
  {
    icon: Utensils,
    titleIndex: 1,
    level: 98,
    details: [
      "Doskonała technika rolowania hosomaki, futomaki i uramaki",
      "Tworzenie signature rolls inspirowanych różnymi kuchniami",
      "Precyzyjne cięcie rolek z zachowaniem idealnej prezentacji",
      "Kreatywne wykorzystanie tekstur i kolorów w kompozycji",
      "Znajomość tradycyjnych i nowoczesnych technik dekoracji",
    ],
  },
  {
    icon: ChefHat,
    titleIndex: 2,
    level: 92,
    details: [
      "Znajomość zasad wabi-sabi i minimalizmu japońskiego",
      "Wykorzystanie sezonowych elementów dekoracyjnych (edible flowers, microgreens)",
      "Dobór odpowiednich naczyń i ceramiki do dań",
      "Tworzenie instagramowych kompozycji przyciągających uwagę",
      "Balans między estetyką a funkcjonalnością podania",
    ],
  },
  {
    icon: Shield,
    titleIndex: 3,
    level: 100,
    details: [
      "Certyfikat HACCP i pełna znajomość systemu kontroli punktów krytycznych",
      "Monitorowanie temperatury przechowywania produktów (-18°C do +4°C)",
      "Prowadzenie dokumentacji sanitarno-higienicznej",
      "Kontrola dat ważności i rotacja surowców FIFO",
      "Przestrzeganie standardów GMP i GHP w kuchni",
      "Szkolenie personelu z zakresu bezpieczeństwa żywności",
    ],
  },
  {
    icon: GraduationCap,
    titleIndex: 4,
    level: 96,
    details: [
      "Opracowywanie programów szkoleniowych dla nowych pracowników",
      "Praktyczne warsztaty z krojenia ryb i rolowania sushi",
      "Nauczanie standardów obsługi i komunikacji z klientem",
      "Mentoring i rozwój umiejętności kulinarnych zespołu",
      "Tworzenie dokumentacji szkoleniowej i procedur standaryzacji",
    ],
  },
  {
    icon: Laptop,
    titleIndex: 5,
    level: 85,
    details: [
      "Tworzenie responsywnych stron internetowych dla restauracji",
      "Integracja systemów zamówień online i rezerwacji stolików",
      "Projektowanie menu cyfrowych i kart win",
      "Znajomość HTML, CSS, podstawy JavaScript i CMS (WordPress, Wix)",
      "Optymalizacja SEO dla lokalnej gastronomii",
    ],
  },
  {
    icon: FileText,
    titleIndex: 6,
    level: 97,
    details: [
      "Precyzyjne opracowywanie receptur z gramaturami składników",
      "Kalkulacja kosztów surowców i marży na daniach",
      "Dokumentacja procesów produkcyjnych krok po kroku",
      "Tworzenie instrukcji stanowiskowych dla różnych pozycji w kuchni",
      "Standaryzacja produkcji w celu utrzymania jakości",
    ],
  },
  {
    icon: Users,
    titleIndex: 7,
    level: 88,
    details: [
      "Planowanie grafików i podział obowiązków w zespole",
      "Zarządzanie zamówieniami surowców i kontrola stanów magazynowych",
      "Optymalizacja procesów kuchennych i mise en place",
      "Nadzór nad jakością produkcji i prezentacji dań",
      "Współpraca z dostawcami i negocjacja cen",
    ],
  },
  {
    icon: Award,
    titleIndex: 8,
    level: 90,
    details: [
      "Łączenie japońskich technik z kuchnią europejską, peruwiańską i azjatycką",
      "Tworzenie signature dishes wykorzystujących lokalne produkty",
      "Eksperymentowanie z fermentacją, marynowaniem i technikami sous-vide",
      "Balans między tradycją a nowoczesnością w menu",
      "Znajomość trendów kulinarnych: plant-based sushi, umami bombs",
    ],
  },
];

export default function Skills() {
  const { t } = useLanguage();
  const skills = getSkillsData();
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [expandedSkill, setExpandedSkill] = useState<number | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const toggleSkill = (index: number) => {
    setExpandedSkill(expandedSkill === index ? null : index);
  };

  // Scroll to details when a skill is expanded
  useEffect(() => {
    if (expandedSkill !== null && detailsRef.current) {
      setTimeout(() => {
        const element = detailsRef.current;
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth',
          });
        }
      }, 150);
    }
  }, [expandedSkill]);

  return (
    <section id="skills" className="py-24 px-4 bg-[#FEF9F5]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4">
              {t.skills.title}
            </h2>
            <div className="w-20 h-1 bg-[#3BC864] mx-auto rounded-full mb-6" />
            <p className="text-lg text-[#240F24] max-w-2xl mx-auto">
              {t.skills.subtitle}
            </p>
          </div>

          {/* Expanded Skill Details */}
          <AnimatePresence>
            {expandedSkill !== null && (
              <motion.div
                ref={detailsRef}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-8 scroll-mt-24"
              >
                <Card className="p-8 bg-gradient-to-br from-[#3BC864]/10 to-[#C5E98A]/20 border-[#3BC864] shadow-2xl">
                  {(() => {
                    const skill = skills[expandedSkill];
                    const Icon = skill.icon;
                    const skillData = t.skills.items[skill.titleIndex];
                    return (
                      <>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-4 bg-[#3BC864] rounded-xl">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[#1E1A41] mb-1">
                              {skillData.title}
                            </h3>
                            <p className="text-[#240F24]">{skillData.description}</p>
                          </div>
                          <button
                            onClick={() => setExpandedSkill(null)}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                          >
                            <X className="w-6 h-6 text-[#1E1A41]" />
                          </button>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-[#2B6A79]">
                              {t.skills.proficiencyLevel}
                            </span>
                            <span className="text-lg font-bold text-[#1E1A41]">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden shadow-inner">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#3BC864] to-[#C5E98A] shadow-lg"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-[#1E1A41] mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#3BC864] rounded-full"></span>
                            {t.skills.competencyDetails}
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {skill.details.map((detail: string, i: number) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                                className="flex items-start gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                              >
                                <span className="text-[#3BC864] text-xl flex-shrink-0">✓</span>
                                <span className="text-sm text-[#240F24]">{detail}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              const isExpanded = expandedSkill === index;
              const skillData = t.skills.items[skill.titleIndex];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: inView ? 1 : 0, 
                    y: inView ? 0 : 30,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full"
                  layout
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    className={`p-6 transition-all duration-500 bg-white cursor-pointer flex flex-col ${
                      isExpanded 
                        ? 'border-[#3BC864] border-2 shadow-2xl ring-4 ring-[#3BC864]/20' 
                        : 'border-[#E0D8D0] hover:shadow-xl hover:border-[#C5E98A]'
                    }`}
                    onClick={() => toggleSkill(index)}
                    style={{ minHeight: '280px' }}
                  >
                    <div className="flex flex-col flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg flex-shrink-0 transition-colors ${
                          isExpanded ? 'bg-[#3BC864] text-white' : 'bg-[#3BC864]/10 text-[#3BC864]'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-[#1E1A41] mb-2 leading-tight">
                            {skillData.title}
                          </h3>
                          <p className="text-sm text-[#240F24] line-clamp-3">
                            {skillData.description}
                          </p>
                        </div>
                      </div>

                      {/* Skill level bar */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[#2B6A79]">
                            {t.skills.proficiencyLevel}
                          </span>
                          <span className="text-sm font-semibold text-[#1E1A41]">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-[#C5E98A]/30 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-[#3BC864] rounded-full"
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${skill.level}%` } : {}}
                            transition={{
                              duration: 1,
                              delay: index * 0.1 + 0.3,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </div>
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
