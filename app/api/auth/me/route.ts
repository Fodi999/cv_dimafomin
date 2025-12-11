import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = `${BACKEND_URL}/api/auth/me`;

    console.log("👤 [Proxy] Get user info request to:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": req.headers.get("authorization") || "",
        "Cookie": req.headers.get("cookie") || "",
      },
    });

    console.log("📥 [Proxy] Backend response status:", res.status);

    const data = await res.text();
    
    return new Response(data, { 
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("❌ [Proxy] Get user info error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Internal proxy error",
        error: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
