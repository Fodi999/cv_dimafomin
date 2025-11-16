"use client";

import { motion } from "framer-motion";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { ReactNode } from "react";

interface RecipesLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function RecipesLayout({ children, modal }: RecipesLayoutProps) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}
