import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/uuid";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

// 🚧 TEMPORARY: Allow testUserID in development
const ALLOW_TEST_USER_ID = process.env.NODE_ENV === "development";

/**
 * POST /api/recipes/recommendations
 * Get AI-recommended recipe based on fridge contents
 * 
 * Protected route - requires JWT token
 */
export async function POST(req: NextRequest) {
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

    // Get request body
    const body = await req.json();
    const { mode = "fridge", limit = 10, excludeRecipeIds = [] } = body;

    // 🚧 TEMPORARY: Extract userId from JWT for backend compatibility
    let backendUrl = `${BACKEND_URL}/api/recipes/recommendations`;
    
    if (ALLOW_TEST_USER_ID) {
      const userId = getUserIdFromToken(token);
      if (userId) {
        backendUrl += `?testUserID=${userId}`;
        console.log("🚧 [DEV MODE] Adding testUserID to query params:", userId);
      }
    }

    console.log(`🎯 [POST /api/recipes/recommendations]`);
    console.log("   Mode:", mode);
    console.log("   Limit:", limit);
    console.log("   ExcludeRecipeIds:", excludeRecipeIds);
    console.log("   Proxying to backend:", backendUrl);

    // Build request body - only include excludeRecipeIds if not empty
    const requestBody: any = { mode, limit };
    if (excludeRecipeIds && excludeRecipeIds.length > 0) {
      requestBody.excludeRecipeIds = excludeRecipeIds;
    }

    // Proxy request to Go backend
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", response.status, errorText);
      console.error("❌ Request was:", {
        url: backendUrl,
        headers: { Authorization: `Bearer ${token.substring(0, 20)}...` },
        body: { mode, limit, excludeRecipeIds }
      });
      
      return NextResponse.json(
        { success: false, message: `Backend error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Recommendation received");
    console.log("   Recipe:", data.data?.recipe?.localName);
    console.log("   Can cook now:", data.data?.match?.canCookNow);
    console.log("   Used ingredients:", data.data?.match?.usedIngredients?.length || 0);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`❌ [POST /api/recipes/recommendations] Error:`, error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
