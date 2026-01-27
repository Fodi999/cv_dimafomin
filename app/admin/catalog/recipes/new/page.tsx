import { Metadata } from "next";
import { CreateRecipeWithAI } from "@/components/admin/catalog/recipes/CreateRecipeWithAI";

export const metadata: Metadata = {
  title: "Create Recipe | Admin",
  description: "Create a new recipe with AI assistance",
};

export default function CreateRecipePage() {
  return (
    <div className="w-full">
      <CreateRecipeWithAI />
    </div>
  );
}
