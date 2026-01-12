import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend-url";

const BACKEND_URL = getBackendUrl();

/**
 * GET /api/market/recipes
 * Returns list of available recipes/courses for purchase
 * 
 * Response:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: "uuid",
 *       title: "Recipe Title",
 *       type: "course" | "recipe",
 *       level: "beginner" | "intermediate" | "advanced",
 *       rating: 4.9,
 *       reviews: 234,
 *       priceCT: 150,
 *       image: "unsplash-url",
 *       owned: false
 *     }
 *   ]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Market API] Fetching recipes from backend");

    const response = await fetch(`${BACKEND_URL}/market/recipes`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Market API] Backend error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch market recipes", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[Market API] Received data:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[Market API] Fatal error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
