import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактирование профиля | Suши Chef",
  description: "Редактируйте ваш профиль и управляйте личной информацией",
};

export default function EditProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
