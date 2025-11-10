import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "AI Culinary Academy | Dima Fomin",
  description: "Akademia sztuki sushi i gastronomii online z AI mentorem",
  keywords: ["sushi academy", "culinary courses", "online cooking", "AI mentor"],
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEF9F5]">
      <main className="flex-1 container mx-auto px-4 py-24 relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
