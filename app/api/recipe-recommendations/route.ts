import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for recipe recommendations
 * Forwards requests to Go backend
 * 
 * Usage:
 * GET /api/recipe-recommendations?lang=ru&limit=10
 */

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") ?? "ru";
    const limit = url.searchParams.get("limit") ?? "10";

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // 🟢 Forward to Go backend
    const backendRes = await fetch(
      `${apiUrl}/api/recipe-recommendations?lang=${lang}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!backendRes.ok) {
      console.error(
        `Backend error: ${backendRes.status}`,
        await backendRes.text()
      );
      return NextResponse.json(
        { error: "Failed to fetch recommendations from backend" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Recipe recommendations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
