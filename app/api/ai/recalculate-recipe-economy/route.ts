import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * POST /api/ai/recalculate-recipe-economy
 * 
 * Recalculates economy for existing recipe based on current fridge state.
 * Used when user adds missing ingredients and we need to update economy without regenerating recipe.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { ingredients } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid ingredients array" },
        { status: 400 }
      );
    }

    console.log("🔄 Recalculating recipe economy for", ingredients.length, "ingredients");

    // Call backend endpoint to recalculate economy
    const backendUrl = `${BACKEND_URL}/api/ai/recipe/recalculate-economy`;
    
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ingredients: ingredients.map((ing: any) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", response.status, errorText);
      return NextResponse.json(
        { success: false, error: "Backend request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Economy recalculated:", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ Error recalculating recipe economy:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
