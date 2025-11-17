import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  prompt: string;
  cuisine?: string;
  difficulty?: string;
}

interface Recipe {
  name: string;
  description: string;
  image: string;
  cuisine: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  price: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
  tags: string[];
}

interface GenerateResponse {
  success: boolean;
  recipe?: Recipe;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    console.log("📥 Received request:", body);

    // Отримуємо URL бекенду з environment variables
    const backendUrl = process.env.RECIPE_API_URL || "http://localhost:8080";
    const apiEndpoint = `${backendUrl}/api/generate-recipe`;

    console.log(`🌐 Calling Go backend at: ${apiEndpoint}`);

    // Відправляємо запит до Go бекенду
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: body.prompt,
        cuisine: body.cuisine,
        difficulty: body.difficulty,
      }),
      // Timeout після 30 секунд
      signal: AbortSignal.timeout(30000),
    });

    console.log(`📊 Go backend response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Go backend error (${response.status}):`, errorText);

      return NextResponse.json(
        {
          success: false,
          error: `Go backend returned ${response.status}: ${response.statusText}. ${errorText}`,
        } as GenerateResponse,
        { status: response.status }
      );
    }

    const recipe: GenerateResponse = await response.json();
    console.log("✅ Recipe generated successfully");

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("❌ Error calling recipe generator API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Якщо бекенд не доступен, повертаємо інформативну помилку
    if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("fetch failed")) {
      return NextResponse.json(
        {
          success: false,
          error: `Go backend is not available at ${process.env.RECIPE_API_URL || "http://localhost:8080"}. Please ensure the Go server is running.`,
        } as GenerateResponse,
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: `Failed to generate recipe: ${errorMessage}`,
      } as GenerateResponse,
      { status: 500 }
    );
  }
}
