import { getBackendUrl } from "@/lib/api/backend-url";

const BACKEND_URL = getBackendUrl();

export async function GET(req: Request) {
  // 🔑 Получаем токен из query параметра (EventSource не поддерживает кастомные заголовки)
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    console.error("❌ [SSE] No token provided in query parameter");
    return new Response(JSON.stringify({ error: "Authorization required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const backendUrl = `${BACKEND_URL}/api/admin/treasury/stream`;
  
  console.log("🔄 [SSE Proxy] Connecting to backend stream:", backendUrl);

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // 🔑 Используем токен из query параметра
        Cookie: req.headers.get("cookie") || "",
        "Accept": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

    if (!res.ok) {
      console.error("❌ [SSE Proxy] Backend error:", res.status);
      return new Response(JSON.stringify({ error: "Backend SSE error" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ [SSE Proxy] Connected to backend stream");

    // Проксируем SSE поток напрямую
    return new Response(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("❌ [SSE Proxy] Connection error:", error);
    return new Response(JSON.stringify({ error: "Failed to connect to backend" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
