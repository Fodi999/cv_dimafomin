import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const backendUrl = `${BACKEND_URL}/api/auth/register`;

    console.log("📝 [Proxy] Register request to:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: body,
    });

    console.log("📥 [Proxy] Backend response status:", res.status);

    const data = await res.text();
    
    // Если успешно, устанавливаем cookie
    if (res.ok) {
      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      
      // Копируем Set-Cookie заголовки из ответа бэкенда
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        headers.set("set-cookie", setCookie);
        console.log("🍪 [Proxy] Setting cookie from backend");
      }
      
      return new Response(data, { 
        status: res.status,
        headers: headers
      });
    }

    return new Response(data, { 
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("❌ [Proxy] Register error:", error);
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
