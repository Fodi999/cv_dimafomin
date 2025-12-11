import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

export async function GET(req: NextRequest) {
  // Fallback данные для демонстрации
  const fallbackData = {
    success: true,
    balance: 999994000,
    totalIssued: 1000000000,
    totalCirculating: 994000,
  };

  try {
    const backendUrl = `${BACKEND_URL}/api/public/treasury`;

    console.log("💰 [Proxy] Public treasury request to:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    console.log("📥 [Proxy] Backend response status:", res.status);

    // Если бэкенд вернул 404 или другую ошибку, используем fallback
    if (!res.ok) {
      console.log("⚠️ [Proxy] Backend returned error, using fallback data");
      return new Response(
        JSON.stringify(fallbackData), 
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const data = await res.text();
    
    // Проверяем, что данные валидные
    try {
      const parsed = JSON.parse(data);
      return new Response(JSON.stringify(parsed), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch {
      // Если парсинг не удался, возвращаем fallback
      console.log("⚠️ [Proxy] Invalid JSON from backend, using fallback data");
      return new Response(
        JSON.stringify(fallbackData), 
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

  } catch (error) {
    console.error("❌ [Proxy] Public treasury error:", error);
    
    // Возвращаем фиктивные данные
    return new Response(
      JSON.stringify(fallbackData), 
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
