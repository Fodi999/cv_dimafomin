"use client";

import { useParams } from "next/navigation";
import { RecipeModalContent, RecipeModalData } from "@/components/recipes/RecipeModalContent";

// Mock data - замените на реальный API
const MOCK_RECIPES: Record<string, RecipeModalData> = {
  "1": {
    id: "1",
    title: "Signature Sushi Roll",
    description: "Наша фирменная роль с лучшими ингредиентами и идеальным вкусовым балансом",
    imageUrl: "https://i.postimg.cc/B63F53xY/DSCF4622.jpg",
    author: {
      id: "dima",
      name: "Dima Fomin",
      level: 10,
      avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg",
    },
    difficulty: "intermediate",
    cookingTime: 25,
    servings: 2,
    category: "Sushi",
    rating: 4.8,
    likes: 1250,
    comments: 45,
    tokensEarned: 150,
    ingredients: [
      "200g ryż sushi",
      "Liść nori",
      "100g łosoś",
      "Avocado",
      "Ogórek",
      "Sos sojowy",
      "Wasabi",
      "Imbirowy pickled",
    ],
    steps: [
      "Przygotuj ryż sushi gotując w proporcji 1:1 z wodą",
      "Wymieszaj ryż z mieszanką octu (100ml octu ryżowego, 2 łyżki cukru, 1 łyżka soli)",
      "Postaw liść nori na bambusowej macie",
      "Rozprowadź cienką warstwę ryżu na nori",
      "Ułóż składniki wzdłuż krawędzi (łosoś, awokado, ogórek)",
      "Przewróć matę aby nori był na wierzchu",
      "Skrajai ostrym nożem przy użyciu wilgotnego papieru",
      "Serwuj z sosem sojowym, wasabi i imbirem",
    ],
  },
  "2": {
    id: "2",
    title: "Fresh Nigiri Assortment",
    description: "Zestaw świeżych nigiri z różnymi rodzajami ryb",
    imageUrl: "https://i.postimg.cc/ZKbct8yq/DSCF4592_Original.jpg",
    author: {
      id: "dima",
      name: "Dima Fomin",
      level: 10,
      avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg",
    },
    difficulty: "beginner",
    cookingTime: 20,
    servings: 1,
    category: "Sushi",
    rating: 4.9,
    likes: 2100,
    comments: 78,
    tokensEarned: 200,
    ingredients: [
      "200g ryż sushi",
      "100g łosoś",
      "80g tuńczyk",
      "Małże",
      "Krewetka",
      "Nori (paska)",
    ],
    steps: [
      "Przygotuj ryż sushi i ostudy go do temperatury pokojowej",
      "Posiekaj ryby na kawałki 1x1x2cm",
      "Nasypuj ryż w dłoń i uformuj owalnym kształtem",
      "Ułóż ryb na wierzchu ryżu",
      "Przycisk lekko palcem wskazującym",
      "Zawinęli cienki pasek nori wokół",
      "Serwuj natychmiast",
    ],
  },
};

const RECIPE_IDS = Object.keys(MOCK_RECIPES);

export default function RecipeModal() {
  const params = useParams();
  const recipeId = params.id as string;

  const recipe = MOCK_RECIPES[recipeId];
  const currentIndex = RECIPE_IDS.indexOf(recipeId);
  const prevRecipeId =
    currentIndex > 0 ? RECIPE_IDS[currentIndex - 1] : undefined;
  const nextRecipeId =
    currentIndex < RECIPE_IDS.length - 1
      ? RECIPE_IDS[currentIndex + 1]
      : undefined;

  if (!recipe) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-lg">Przepis nie znaleziony</p>
      </div>
    );
  }

  return (
    <RecipeModalContent
      recipe={recipe}
      prevRecipeId={prevRecipeId}
      nextRecipeId={nextRecipeId}
    />
  );
}
