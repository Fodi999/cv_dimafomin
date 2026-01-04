import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/uuid";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

// 🚧 TEMPORARY: Allow testUserID in development
const ALLOW_TEST_USER_ID = process.env.NODE_ENV === "development";

/**
 * GET /api/recipes/available
 * Get recipes categorized by cooking feasibility (canCook, almostCook, needToBuy)
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

    console.log("🔍 [GET /api/recipes/available] Proxying to backend:", `${BACKEND_URL}/api/recipes/available`);
    console.log("   Query params:", params.toString());

    // 🌍 Get Accept-Language from request headers
    const acceptLanguage = req.headers.get("Accept-Language") || "pl";
    console.log("🌍 Accept-Language:", acceptLanguage);

    // Proxy request to Go backend
    const response = await fetch(`${BACKEND_URL}/api/recipes/available?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
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
    
    // 🔍 DEBUG: Check backend response structure
    console.log("✅ Available recipes returned:", {
      canCook: data.data?.canCookCount || 0,
      almostCook: data.data?.almostCookCount || 0,
      needToBuy: data.data?.needToBuyCount || 0,
      total: data.data?.totalCount || 0
    });
    
    // 🔍 DEBUG: Check if first recipe has localized title
    if (data.data?.canCook?.[0]) {
      const firstRecipe = data.data.canCook[0];
      console.log("🔍 First recipe structure:", {
        canonicalName: firstRecipe.canonicalName,
        localName: firstRecipe.localName,
        title: firstRecipe.title,
        hasTitle: !!firstRecipe.title,
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ [GET /api/recipes/available] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
