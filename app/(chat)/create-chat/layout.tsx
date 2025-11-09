import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Рецепт-Чат | Dima Fomin",
  description: "Створіть рецепт у діалозі з AI Шеф-Асистентом",
};

export default function CreateChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Standalone layout - no navigation, no footer
  // Full-screen chat experience
  return <>{children}</>;
}
