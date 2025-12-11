import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

export async function POST(req: NextRequest) {
  try {
    const backendUrl = `${BACKEND_URL}/api/auth/logout`;

    console.log("🚪 [Proxy] Logout request to:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Authorization": req.headers.get("authorization") || "",
        "Cookie": req.headers.get("cookie") || "",
      },
    });

    console.log("📥 [Proxy] Backend response status:", res.status);

    const data = await res.text();
    
    // Копируем заголовки для удаления cookie
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      headers.set("set-cookie", setCookie);
      console.log("🍪 [Proxy] Clearing cookie from backend");
    }
    
    return new Response(data, { 
      status: res.status,
      headers: headers
    });

  } catch (error) {
    console.error("❌ [Proxy] Logout error:", error);
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
