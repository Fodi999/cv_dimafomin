import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

/**
 * POST /api/recipes/[id]/cook
 * Mark recipe as cooked and deduct ingredients from fridge
 * 
 * Protected route - requires JWT token
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔐 Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - token required" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Await params (Next.js 15+ requirement)
    const resolvedParams = await params;
    const recipeId = resolvedParams.id;

    if (!recipeId) {
      return NextResponse.json(
        { success: false, message: "Recipe ID required" },
        { status: 400 }
      );
    }

    // Get request body
    const body = await req.json();
    const { servingsMultiplier, idempotencyKey } = body;

    if (!idempotencyKey) {
      return NextResponse.json(
        { success: false, message: "idempotencyKey required" },
        { status: 400 }
      );
    }

    console.log(`👨‍🍳 [POST /api/recipes/${recipeId}/cook]`);
    console.log("   Idempotency key:", idempotencyKey);
    console.log("   Servings multiplier:", servingsMultiplier || 1);
    console.log("   Proxying to backend:", `${BACKEND_URL}/api/recipes/${recipeId}/cook`);

    // Proxy request to Go backend
    const response = await fetch(`${BACKEND_URL}/api/recipes/${recipeId}/cook`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        servingsMultiplier: servingsMultiplier || 1,
        idempotencyKey,
      }),
    });

    console.log("📡 Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", response.status, errorText);
      
      // Check for duplicate request (idempotency)
      if (response.status === 409) {
        return NextResponse.json(
          { success: false, message: "Recipe already cooked with this key (duplicate request)" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Recipe cooked successfully");
    console.log("   Ingredients used:", data.data?.ingredientsUsed?.length || 0);
    console.log("   Used value:", data.data?.economySnapshot?.usedValue || 0);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`❌ [POST /api/recipes/[id]/cook] Error:`, error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
