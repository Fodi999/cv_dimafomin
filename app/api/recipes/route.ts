import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * Mock recipes for development/testing
 */
function getMockRecipes() {
  return [
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
}

/**
 * GET /api/recipes
 * Get complete recipe catalog from backend
 * 
 * This is the SINGLE SOURCE OF TRUTH for all recipes.
 * Used by:
 * - 🍱 Przepisy page (catalog view)
 * - 🤖 AI recommendations (subset)
 * - 📊 Stats endpoint (count)
 * 
 * Public endpoint - no auth required
 * 
 * Query Parameters:
 * - country: Poland, Italy, Japan, etc
 * - category: main, soup, salad, pizza, dessert, sushi
 * - difficulty: easy, medium, hard
 * - maxTime: maximum cooking time in minutes
 * - limit: number of recipes (default: 20, max: 100)
 */
export async function GET(req: NextRequest) {
  try {
    console.log("\n📚 [GET /api/recipes] Request received");
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const difficulty = searchParams.get('difficulty');
    const maxTime = searchParams.get('maxTime');
    const limit = searchParams.get('limit') || '100';
    const lang = searchParams.get('lang') || 'ru';

    console.log("   Query params:", { lang, limit, category, difficulty, maxTime });

    // Get token from request headers
    const token = req.headers.get('authorization');
    console.log("   Has token:", !!token);

    // Build backend URL with query params
    let backendUrl = `${BACKEND_URL}/api/recipes`;
    const params = new URLSearchParams();
    
    params.append('lang', lang);
    params.append('limit', limit);
    if (category) params.append('category', category);
    if (country) params.append('country', country);
    if (difficulty) params.append('difficulty', difficulty);
    if (maxTime) params.append('maxTime', maxTime);
    
    if (params.toString()) {
      backendUrl += `?${params.toString()}`;
    }

    console.log("   Backend URL:", backendUrl);

    // Build headers for backend call
    const backendHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Pass authorization if provided
    if (token) {
      backendHeaders["Authorization"] = token;
    }

    // Fetch from Go backend
    console.log("   🔄 Fetching from backend...");
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: backendHeaders,
      cache: "no-store", // Always get fresh data
    });

    console.log("   📡 Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("   ❌ Backend error:", response.status, errorText);
      console.warn("   ⚠️ Falling back to mock data");
      
      // Return mock data if backend fails
      const mockRecipes = getMockRecipes();
      const mockResponse = {
        success: true,
        message: "Using mock data (backend unavailable)",
        recipes: mockRecipes,
        data: mockRecipes,
        count: mockRecipes.length,
        filters: {
          categories: ["soup", "salad", "main", "dessert"],
          difficulties: ["easy", "medium", "hard"],
          dietTags: ["vegetarian", "vegan"],
        }
      };
      console.log("   ✅ Returning mock data:", mockRecipes.length, "recipes");
      return NextResponse.json(mockResponse, { status: 200 });
    }

    const data = await response.json();
    console.log("   ✅ Backend response received");
    
    // Backend returns { success: true, data: { recipes: [...], count: N, filters: {...} } }
    // We normalize it to both formats for frontend compatibility
    const normalizedData = {
      success: data.success,
      recipes: data.data?.recipes || data.recipes || [],
      data: data.data?.recipes || data.recipes || [],
      count: data.data?.count || 0,
      filters: data.data?.filters || {}
    };
    
    console.log("✅ Catalog loaded successfully");
    console.log("   Total recipes:", normalizedData.count);

    return NextResponse.json(normalizedData, { 
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      }
    });
    
  } catch (error: any) {
    console.error("❌ [GET /api/recipes] Error:", error);
    console.warn("⚠️ Falling back to mock data");
    
    // Return mock data on error
    const mockRecipes = getMockRecipes();
    const mockResponse = {
      success: true,
      message: "Using mock data (error occurred)",
      recipes: mockRecipes,
      data: mockRecipes,
      count: mockRecipes.length,
      filters: {
        categories: ["soup", "salad", "main", "dessert"],
        difficulties: ["easy", "medium", "hard"],
        dietTags: ["vegetarian", "vegan"],
      }
    };
    console.log("   ✅ Returning mock data:", mockRecipes.length, "recipes");
    return NextResponse.json(mockResponse, { status: 200 });
  }
}
