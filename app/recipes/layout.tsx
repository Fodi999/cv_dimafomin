"use client";

import { ReactNode } from "react";

interface RecipesLayoutProps {
  children: ReactNode;
}

export default function RecipesLayout({ children }: RecipesLayoutProps) {
  return <>{children}</>;
}
