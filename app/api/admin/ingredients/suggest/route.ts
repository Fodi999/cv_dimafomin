import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

/**
 * GET /api/admin/ingredients/suggest
 * Получить подсказки для автокомплита продуктов
 * 
 * Query params:
 * - q: string (search query)
 * - limit: number (max results, default 5)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || "5";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Get auth token from cookie
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log(`[Suggest API] Fetching suggestions for: "${query}", limit: ${limit}`);

    // Forward request to backend
    const backendUrl = `${BACKEND_API_URL}/admin/ingredients/suggest?q=${encodeURIComponent(query)}&limit=${limit}`;
    
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Suggest API] Backend error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[Suggest API] Found ${data.suggestions?.length || 0} suggestions`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Suggest API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
