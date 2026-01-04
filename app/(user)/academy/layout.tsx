import type { Metadata } from "next";

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
    <div className="min-h-screen">
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
