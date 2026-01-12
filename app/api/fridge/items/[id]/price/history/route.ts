import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * GET /api/fridge/items/{id}/price/history
 * Получить историю изменения цен продукта
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get token from Authorization header
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token not found" },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/fridge/items/${id}/price/history`;
    console.log("[Price History API] GET from backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": token,
      },
    });

    console.log("[Price History API] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Price History API] Backend error:", errorText);
      return NextResponse.json(
        { error: "Failed to get price history", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[Price History API] Backend response data:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Price History API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
