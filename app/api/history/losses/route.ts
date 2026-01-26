import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

/**
 * GET /api/history/losses
 * Получить историю потерь/списаний
 * 
 * Query params:
 * - days: количество дней (default: 30)
 */
export async function GET(request: NextRequest) {
  // proxyToBackend автоматически передает query параметры из request.url
  return proxyToBackend(request, {
    endpoint: `/api/history/losses`,
    method: "GET",
  });
}
