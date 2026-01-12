import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

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
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const difficulty = searchParams.get('difficulty');
    const maxTime = searchParams.get('maxTime');
    const limit = searchParams.get('limit');

    // Build backend URL with query params
    let backendUrl = `${BACKEND_URL}/api/recipes`;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (country) params.append('country', country);
    if (difficulty) params.append('difficulty', difficulty);
    if (maxTime) params.append('maxTime', maxTime);
    if (limit) params.append('limit', limit);
    
    if (params.toString()) {
      backendUrl += `?${params.toString()}`;
    }

    console.log(`📚 [GET /api/recipes] Fetching catalog from backend...`);
    console.log("   Backend URL:", backendUrl);
    if (params.toString()) {
      console.log("   Filters:", Object.fromEntries(params));
    }

    // Fetch from Go backend
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always get fresh data
    });

    console.log("📡 Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", response.status, errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Backend error: ${response.status}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Backend returns { success: true, data: { recipes: [...], count: N, filters: {...} } }
    // We normalize it to { success: true, data: [...] } for frontend
    const normalizedData = {
      success: data.success,
      data: data.data?.recipes || [],
      count: data.data?.count || 0,
      filters: data.data?.filters || {}
    };
    
    console.log("✅ Catalog loaded successfully");
    console.log("   Total recipes:", normalizedData.count);

    return NextResponse.json(normalizedData, { status: 200 });
    
  } catch (error: any) {
    console.error("❌ [GET /api/recipes] Error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch recipe catalog",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
