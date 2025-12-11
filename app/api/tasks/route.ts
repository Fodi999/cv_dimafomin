const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

export async function GET(req: Request) {
  // Извлекаем query параметры из URL
  const url = new URL(req.url);
  const searchParams = url.searchParams.toString();
  
  const backendUrl = `${BACKEND_URL}/api/tasks${searchParams ? `?${searchParams}` : ""}`;

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: req.headers.get("authorization") || "",
      Cookie: req.headers.get("cookie") || "",
    },
  });

  const data = await res.text();
  return new Response(data, { status: res.status });
}
