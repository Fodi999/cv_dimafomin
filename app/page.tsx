"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import AcademyHero from "@/components/sections/AcademyHero";
import AcademyAbout from "@/components/sections/AcademyAbout";
import AcademyAIMentor from "@/components/sections/AcademyCourses";
import AcademyChefTokens from "@/components/sections/AcademyChefTokens";
import AcademyCoursesPreview from "@/components/sections/AcademyCoursesPreview";
import AcademyFooter from "@/components/sections/AcademyFooter";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";
import DynamicMetaTags from "@/components/DynamicMetaTags";
import StructuredData from "@/components/StructuredData";
import DevelopmentModal from "@/components/DevelopmentModal";

export default function Home() {
  return (
    <>
      <DynamicMetaTags />
      <StructuredData />
      <ScrollProgress />
      <ScrollToTop />
      
      {/* 🆕 Public Header - мінімальна навігація для landing */}
      <PublicHeader />
      
      {/* Модальное окно "Сайт в разработке" */}
      <DevelopmentModal />
      
      <main className="relative w-full min-h-screen overflow-y-auto pt-16">
        <AcademyHero />
        <AcademyAbout />
        <AcademyChefTokens />
        <AcademyAIMentor />
        <AcademyCoursesPreview />
        <AcademyFooter />
      </main>
    </>
  );
}
