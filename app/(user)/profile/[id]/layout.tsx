import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профиль пользователя | Suши Chef",
  description: "Просмотр профиля пользователя и его публикаций",
};

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
