import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend-url";
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

    // Get backend URL (always use Koyeb)
    const backendUrl = 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';
    const apiEndpoint = `${backendUrl}/api/generate-recipe`;

    console.log(`🌐 Calling Go backend at: ${apiEndpoint}`);

    // Send request to Go backend
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
      // Timeout after 30 seconds
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

    // If backend not available, return informative error
    if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("fetch failed")) {
      return NextResponse.json(
        {
          success: false,
          error: `Go backend is not available at https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app. Please ensure the Go server is running.`,
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
