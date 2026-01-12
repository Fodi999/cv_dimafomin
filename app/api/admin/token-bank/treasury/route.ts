import { getBackendUrl } from "@/lib/api/backend-url";

const BACKEND_URL = getBackendUrl();

export async function GET(req: Request) {
  const backendUrl = `${BACKEND_URL}/api/admin/token-bank/treasury`;

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
