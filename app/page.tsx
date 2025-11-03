"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Navigation from "@/components/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";
import StructuredData from "@/components/StructuredData";
import DynamicMetaTags from "@/components/DynamicMetaTags";

export default function Home() {
  return (
    <>
      <DynamicMetaTags />
      <StructuredData />
      <ScrollProgress />
      <Navigation />
      <ScrollToTop />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Portfolio />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
