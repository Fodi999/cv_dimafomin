import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

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
    console.log("✅ Recipe matches returned:", data.data?.length || 0, "recipes");

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ [GET /api/recipes/match] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
