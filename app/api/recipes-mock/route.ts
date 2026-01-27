import { NextRequest, NextResponse } from "next/server";

/**
 * Mock recipes data for development/testing
 * Replace with actual backend call when backend is ready
 */

const MOCK_RECIPES = [
  {
    id: "recipe-1",
    title: "Борщ украинский",
    canonical_name: "borscht_ukrainian",
    description: "Традиционный украинский борщ со сметаной",
    image_url: "https://via.placeholder.com/300x200?text=Борщ",
    cook_time: 60,
    servings: 4,
    difficulty: "easy",
    category: "soup",
    diet_tags: ["vegetarian"],
    allergens: [],
  },
  {
    id: "recipe-2",
    title: "Цезарь с курицей",
    canonical_name: "caesar_salad_chicken",
    description: "Классический салат с курицей и пармезаном",
    image_url: "https://via.placeholder.com/300x200?text=Цезарь",
    cook_time: 15,
    servings: 2,
    difficulty: "easy",
    category: "salad",
    diet_tags: [],
    allergens: ["dairy", "eggs"],
  },
  {
    id: "recipe-3",
    title: "Паста Карбонара",
    canonical_name: "pasta_carbonara",
    description: "Итальянская паста со сливочным соусом",
    image_url: "https://via.placeholder.com/300x200?text=Паста",
    cook_time: 20,
    servings: 2,
    difficulty: "medium",
    category: "main",
    diet_tags: [],
    allergens: ["dairy", "eggs"],
  },
  {
    id: "recipe-4",
    title: "Суши роллы",
    canonical_name: "sushi_rolls",
    description: "Классические суши роллы с рисом и лососем",
    image_url: "https://via.placeholder.com/300x200?text=Суши",
    cook_time: 45,
    servings: 4,
    difficulty: "hard",
    category: "main",
    diet_tags: [],
    allergens: ["fish"],
  },
  {
    id: "recipe-5",
    title: "Греческий салат",
    canonical_name: "greek_salad",
    description: "Свежий салат с фетой и маслинами",
    image_url: "https://via.placeholder.com/300x200?text=Греческий+салат",
    cook_time: 10,
    servings: 2,
    difficulty: "easy",
    category: "salad",
    diet_tags: ["vegetarian", "vegan"],
    allergens: ["dairy"],
  },
  {
    id: "recipe-6",
    title: "Стейк из говядины",
    canonical_name: "beef_steak",
    description: "Сочный стейк с овощами",
    image_url: "https://via.placeholder.com/300x200?text=Стейк",
    cook_time: 30,
    servings: 2,
    difficulty: "hard",
    category: "main",
    diet_tags: [],
    allergens: [],
  },
  {
    id: "recipe-7",
    title: "Шоколадный торт",
    canonical_name: "chocolate_cake",
    description: "Нежный шоколадный торт с какао",
    image_url: "https://via.placeholder.com/300x200?text=Торт",
    cook_time: 90,
    servings: 8,
    difficulty: "medium",
    category: "dessert",
    diet_tags: [],
    allergens: ["dairy", "eggs", "nuts"],
  },
  {
    id: "recipe-8",
    title: "Минестроне",
    canonical_name: "minestrone_soup",
    description: "Итальянский овощной суп с пастой",
    image_url: "https://via.placeholder.com/300x200?text=Минестроне",
    cook_time: 45,
    servings: 4,
    difficulty: "easy",
    category: "soup",
    diet_tags: ["vegetarian"],
    allergens: [],
  },
  {
    id: "recipe-9",
    title: "Том Ям",
    canonical_name: "tom_yum_soup",
    description: "Острый тайский суп с креветками",
    image_url: "https://via.placeholder.com/300x200?text=Том+Ям",
    cook_time: 25,
    servings: 2,
    difficulty: "medium",
    category: "soup",
    diet_tags: [],
    allergens: ["fish", "shellfish"],
  },
  {
    id: "recipe-10",
    title: "Овощное ризотто",
    canonical_name: "vegetable_risotto",
    description: "Кремовое ризотто с сезонными овощами",
    image_url: "https://via.placeholder.com/300x200?text=Ризотто",
    cook_time: 35,
    servings: 3,
    difficulty: "medium",
    category: "main",
    diet_tags: ["vegetarian"],
    allergens: ["dairy"],
  },
];

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "ru";
    const limit = parseInt(searchParams.get("limit") || "100");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const maxTime = searchParams.get("maxTime");
    const search = searchParams.get("search");
    const dietTags = searchParams.get("dietTags");

    console.log("🔍 [/api/recipes-mock] Fetching recipes");
    console.log("   Filters:", { category, difficulty, maxTime, search, dietTags });

    let filtered = [...MOCK_RECIPES];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.canonical_name.toLowerCase().includes(searchLower) ||
          r.description?.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      filtered = filtered.filter((r) => r.category === category);
    }

    if (difficulty) {
      filtered = filtered.filter((r) => r.difficulty === difficulty);
    }

    if (maxTime) {
      const timeLimit = parseInt(maxTime);
      filtered = filtered.filter((r) => r.cook_time <= timeLimit);
    }

    if (dietTags) {
      filtered = filtered.filter((r) => r.diet_tags.includes(dietTags));
    }

    // Limit results
    filtered = filtered.slice(0, limit);

    const response = {
      success: true,
      data: {
        recipes: filtered,
        count: filtered.length,
        filters: {
          categories: ["soup", "salad", "main", "dessert"],
          difficulties: ["easy", "medium", "hard"],
          dietTags: ["vegetarian", "vegan"],
        },
      },
      recipes: filtered, // For compatibility
    };

    console.log("✅ Recipes mock response:", filtered.length, "recipes found");

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        recipes: [],
        data: { recipes: [] },
      },
      { status: 500 }
    );
  }
}
