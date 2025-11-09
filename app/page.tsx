"use client";

import AcademyHero from "@/components/sections/AcademyHero";
import AcademyAbout from "@/components/sections/AcademyAbout";
import AcademyAIMentor from "@/components/sections/AcademyCourses";
import AcademyCoursesPreview from "@/components/sections/AcademyCoursesPreview";
import AcademyChefTokens from "@/components/sections/AcademyChefTokens";
import AcademyFooter from "@/components/sections/AcademyFooter";
import Navigation from "@/components/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";
import DynamicMetaTags from "@/components/DynamicMetaTags";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <DynamicMetaTags />
      <StructuredData />
      <ScrollProgress />
      <Navigation />
      <ScrollToTop />
      <main className="min-h-screen relative">
        <AcademyHero />
        <AcademyAbout />
        <AcademyAIMentor />
        <AcademyCoursesPreview />
        <AcademyChefTokens />
        <AcademyFooter />
      </main>
    </>
  );
}
