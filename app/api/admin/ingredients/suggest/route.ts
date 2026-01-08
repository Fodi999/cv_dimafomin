import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/api'
  : 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api';

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
    const limit = searchParams.get("limit") || "10";

    if (!query || query.length < 2) {
      return NextResponse.json({
        data: [],
        success: true
      });
    }

    // Get auth token from cookie
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get language from header
    const language = request.headers.get('Accept-Language') || 'pl';

    console.log(`[Suggest API] Fetching suggestions for: "${query}", limit: ${limit}`);

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/admin/ingredients/suggest?q=${encodeURIComponent(query)}&limit=${limit}`;
    
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": language,
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
    console.log(`[Suggest API] Response:`, data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Suggest API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
