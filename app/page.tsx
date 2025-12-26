"use client";

import AcademyHero from "@/components/sections/AcademyHero";
import AcademyAbout from "@/components/sections/AcademyAbout";
import AcademyAIMentor from "@/components/sections/AcademyCourses";
import AcademyChefTokens from "@/components/sections/AcademyChefTokens";
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
      
      {/* Модальное окно "Сайт в разработке" */}
      <DevelopmentModal 
        title="Strona w budowie"
        message="Wkrótce otwarcie!"
      />
      
      <main className="relative w-full min-h-screen overflow-y-auto">
        <AcademyHero />
        <AcademyAbout />
        <AcademyAIMentor />
        <AcademyChefTokens />
        <AcademyFooter />
      </main>
    </>
  );
}
