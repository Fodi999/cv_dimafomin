import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/uuid";
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

// 🚧 TEMPORARY: Allow testUserID in development
const ALLOW_TEST_USER_ID = process.env.NODE_ENV === "development";

/**
 * GET /api/recipes/match
 * Find recipes that match user's fridge contents
 * 
 * Protected route - requires JWT token
 */
export async function GET(req: NextRequest) {
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

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const params = new URLSearchParams();
    
    // Forward all query params to backend
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    // 🚧 TEMPORARY: Extract userId from JWT and add as testUserID for backend compatibility
    // TODO: Remove this once backend implements proper JWT middleware
    if (ALLOW_TEST_USER_ID) {
      const userId = getUserIdFromToken(token);
      if (userId) {
        params.set("testUserID", userId);
        console.log("🚧 [DEV MODE] Adding testUserID from JWT:", userId);
      }
    }

    console.log("🔍 [GET /api/recipes/match] Proxying to backend:", `${BACKEND_URL}/api/recipes/match`);
    console.log("   Query params:", params.toString());

    // Proxy request to Go backend
    const response = await fetch(`${BACKEND_URL}/api/recipes/match?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📡 Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", response.status, errorText);
      
      return NextResponse.json(
        { success: false, message: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Backend response structure:", JSON.stringify(data, null, 2).substring(0, 500));
    console.log("   Has 'data' field:", !!data.data);
    console.log("   Has 'canCook' field:", !!data.canCook);
    console.log("   Has 'canCookCount' field:", !!data.canCookCount);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ [GET /api/recipes/match] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
