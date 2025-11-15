import type { Metadata } from "next";

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
  return children;
}
