import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Recipe Marketplace | Dima Fomin",
  description: "Profesjonalne przepisy sushi od najlepszych chefów",
  keywords: ["sushi recipes", "cooking marketplace", "professional recipes"],
};

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEF9F5]">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
